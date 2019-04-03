import { Forbidden, InternalServerError } from "@curveball/http-errors";
import { NextFunction, Request, Response } from "express";
import { IResourceRepository } from "../repositories/IResourceRepository";
import ControllerFactory from "../repositories/RepositoryFactory";
import { getSchema } from "../routes/index";
import RouterSchema from "../routes/RouterSchema";
import IBaseResource from "../schemas/IBaseResource";

/**
 * Check a user has permission to access a resource
 *
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

  // If there is no id then a resource is not being accessed.
  if (id === undefined || null || "") {
    return next();
  }

  // If the resource has no owner then anyone can view.
  if (!routeSchema.getOptions().isOwned) {
    return next();
  }

  // If the resource has an owner, fetch resource and check user is the owner.
  try {
    resource = await resController.get(id);
  } catch (e) {
    // Throw db error
    res.locals.error = new InternalServerError(e.message);
    return next();
  }

  // Next if owner, throw 403 if not.
  if (res.locals.user.id === `${resource.getUserId()}`) {
    return next();
  } else {
    res.locals.error = new Forbidden("Resource does not belong to user");
    return next();
  }
}
