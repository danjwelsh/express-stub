import { NextFunction, Request, Response } from "express";
import { HttpResponseCodes } from "../HttpResponseCodes";
import { IResourceRepository } from "../repositories/IResourceRepository";
import ControllerFactory from "../repositories/RepositoryFactory";
import { IUser } from "../schemas/IUser";
import { UserRole } from "../UserRole";
import { InternalServerError } from "@curveball/http-errors";

/**
 * Verify a user's JWT token
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

  // Check for errors from previous endpoint
  if (res.locals.error) {
    if (!(res.locals.error.status === HttpResponseCodes.Forbidden)) {
      return next();
    }
  }

  // Fetch the user
  try {
    user = await userRepository.get(res.locals.user.id);
  } catch (e) {
    // Add error to locals
    res.locals.error = new InternalServerError(e.message);
    return next();
  }

  // If admin add admin flag to locals.
  if (user.role === UserRole.ADMIN) {
    res.locals.admin = UserRole.ADMIN;
  }
  return next();
}
