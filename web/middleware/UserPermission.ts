import { NextFunction, Request, Response } from "express";
import * as HttpErrors from "http-errors";
import { HttpResponseCodes } from "../HttpResponseCodes";
import { IResourceRepository } from "../repositories/IResourceRepository";
import ControllerFactory from "../repositories/RepositoryFactory";
import { getSchema } from "../routes/index";
import RouterSchema from "../routes/RouterSchema";
import IBaseResource from "../schemas/IBaseResource";

/**
 * Verfiy a user's JWT token
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export async function userPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const routeSchema: RouterSchema = getSchema(req.originalUrl);
  const resController: IResourceRepository<
    IBaseResource
  > = ControllerFactory.getRepository(routeSchema.getTable());
  let resource: IBaseResource;
  const id: string =
    req.body.id ||
    req.query.id ||
    req.headers.id ||
    req.params.id ||
    req.params.id;

  if (id === undefined || null || "") {
    return next();
  }

  if (!routeSchema.getOptions().isOwned) {
    return next();
  }

  try {
    resource = await resController.get(id);
  } catch (e) {
    res.locals.error = HttpErrors(
      HttpResponseCodes.InternalServerError,
      e.message
    );
    return next();
  }

  if (res.locals.user.id === `${resource.getUserId()}`) {
    return next();
  } else {
    res.locals.error = HttpErrors(
      HttpResponseCodes.Forbidden,
      "Resource does not belong to user"
    );
    return next();
  }
}
