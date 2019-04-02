import {NextFunction, Response, Request} from 'express';
import RouterSchema from '../routes/RouterSchema';
import {getSchema} from '../routes/index';
import ControllerFactory from '../repositories/RepositoryFactory';
import {IResourceRepository} from '../repositories/IResourceRepository';
import IBaseResource from "../schemas/IBaseResource";

/**
 * Verfiy a user's JWT token
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export function userPermission() {
  return (req: Request, res: Response, next: NextFunction) => {
    const id: string =
      req.body.id ||
      req.query.id ||
      req.headers['id'] ||
      req.params.id ||
      req.params['id'];

    if (id === undefined || null || '') {
      return next();
    }

    const routeSchema: RouterSchema = getSchema(req.originalUrl);

    if (!routeSchema.options.isOwned) {
      return next();
    }

    const resController: IResourceRepository<IBaseResource> = ControllerFactory.getRepository(routeSchema.table);

    resController.get(id)
      .then((resource) => {
        if (res.locals.user.id === resource.getUserId().toString()) {
          return next();
        } else {
          res.locals.customErrorMessage = 'Resource does not belong to user';
          res.locals.error = 403;
          next();
        }
      })
      .catch((e) => {
        res.locals.customErrorMessage = e.message;
        res.locals.error = 500;
        next();
      });

    return next();
  }
}
