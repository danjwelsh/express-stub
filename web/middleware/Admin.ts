import { NextFunction, Request, Response } from "express";
import * as HttpError from "http-errors";
import { HttpResponseCodes } from "../HttpResponseCodes";
import { IResourceRepository } from "../repositories/IResourceRepository";
import ControllerFactory from "../repositories/RepositoryFactory";
import { IUser } from "../schemas/IUser";
import { UserRole } from "../UserRole";

/**
 * Verfiy a user's JWT token
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export async function checkAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let user: IUser;
  const userRepository: IResourceRepository<
    IUser
  > = ControllerFactory.getRepository("user");
  if (res.locals.error) {
    if (!(res.locals.error.status === 403)) {
      return next();
    }
  }

  try {
    user = await userRepository.get(res.locals.user.id);
  } catch (e) {
    res.locals.customErrorMessage = e.message;
    res.locals.error = HttpError(
      HttpResponseCodes.InternalServerError,
      e.message
    );
    return next();
  }

  if (user.role === UserRole.ADMIN) {
    res.locals.admin = UserRole.ADMIN;
  }
  return next();
}
