import {
  BadRequest,
  HttpError,
  InternalServerError,
  NotFound
} from "@curveball/http-errors";
import * as e from "express";
import { Schema } from "mongoose";
import { HttpResponseCodes } from "../HttpResponseCodes";
import { Reply } from "../Reply";
import { IResourceRepository } from "../repositories/IResourceRepository";
import RepositoryFactory from "../repositories/RepositoryFactory";
import IBaseResource from "../schemas/IBaseResource";
import { IUser } from "../schemas/IUser";
import BaseResourceRouter from "./BaseResourceRouter";
import { BaseRouter } from "./BaseRouter";
import { getSchema } from "./index";
import IResourceRouter from "./IResourceRouter";
import RouterSchema from "./RouterSchema";

/**
 * ResourceRouter
 *
 * Generic router for all resources named in RouteSchema
 */
export default class ResourceRouter<T extends IBaseResource>
  extends BaseResourceRouter
  implements IResourceRouter<IBaseResource> {
  /**
   * Create the router
   *
   * @param {string} table
   * @param {{isProtected: boolean; isOwned: boolean}} options
   */
  constructor(
    table: string,
    options: { isProtected: boolean; isOwned: boolean }
  ) {
    super();
    this.insertMiddleware(options);
  }

  /**
   * Store a resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public async store(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response> {
    const routeSchema: RouterSchema = getSchema(req.originalUrl);
    const cont: IResourceRepository<T> = RepositoryFactory.getRepository(
      routeSchema.getTable()
    );
    const userId = res.locals.user.id;
    let resource: T;
    const data: any = {};
    const err: HttpError = BaseRouter.errorCheck(res); // check for errors from middleware.

    if (err) {
      return next(err);
    }

    // Create an object from post data
    Object.keys(req.body).forEach((key: string) => {
      data[key] = req.body[key];
    });

    // Add a user id if owned by the user
    if (routeSchema.getOptions().isOwned) {
      data.userId = userId;
    }

    // Store
    try {
      resource = await cont.store(data);
    } catch (e) {
      // Throw db error
      return next(new InternalServerError(e.message));
    }

    // Return the resource
    return res.json(new Reply(200, "success", false, resource));
  }

  /**
   * Destroy the resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public async destroy(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response> {
    const id: string = req.params.id;
    const routeSchema: RouterSchema = getSchema(req.originalUrl);
    const cont: IResourceRepository<T> = RepositoryFactory.getRepository(
      routeSchema.getTable()
    );
    const userRepo: IResourceRepository<
      IUser
    > = RepositoryFactory.getRepository("user");
    const err: HttpError = BaseRouter.errorCheck(res);
    let user: IUser;

    // Throw errors from preceding middleware
    if (err) {
      return next(err);
    }

    // Try to destroy
    try {
      // Destroy resource
      await cont.destroy(id);

      // If the resource is owned by the user...
      if (routeSchema.getOptions().isOwned) {
        // Get the user
        user = await userRepo.get(res.locals.user.id);

        // Get the collection of linked resources
        const resourceList: Array<
          Schema.Types.ObjectId | number
        > = await user.getLinkedCollection(routeSchema.getTable());
        const idx: number = resourceList.findIndex(
          resource => `${resource}` === id
        );
        resourceList.splice(idx, 1);

        // Update collection list and store
        await user.setLinkedCollection(resourceList, routeSchema.getTable());
        await userRepo.edit(user.getId(), user.toJSONObject());
      }
    } catch (e) {
      return next(new InternalServerError(e.message));
    }

    return res.json(new Reply(200, "success", false, {}));
  }

  /**
   * Get all resources
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public async index(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response> {
    const routeSchema: RouterSchema = getSchema(req.originalUrl);
    const cont: IResourceRepository<T> = RepositoryFactory.getRepository(
      routeSchema.getTable()
    );
    const err: HttpError = BaseRouter.errorCheck(res);
    let resources: T[];
    const q: any = req.query;
    const filter: any = {};

    // Apply a filter if given
    Object.keys(q).forEach((key: string) => {
      filter[key] = q[key];
    });

    if (err) {
      return next(err);
    }

    // Get resources
    try {
      // Bypass owner restraint if admin
      if (res.locals.admin) {
        resources = await cont.getAll();
      } else {
        // Return resources user owns
        filter.userId = res.locals.user.id;
        resources = await cont.findManyWithFilter(filter);
      }
    } catch (e) {
      // Throw db error
      return next(new InternalServerError(e.message));
    }

    return res.json(new Reply(200, "success", false, resources));
  }

  /**
   * Get paged resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public async paged(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response> {
    const routeSchema: RouterSchema = getSchema(req.originalUrl);
    const cont: IResourceRepository<T> = RepositoryFactory.getRepository(
      routeSchema.getTable()
    );
    const err: HttpError = BaseRouter.errorCheck(res);
    const page: number = parseInt(req.params.page, 10) || 0;
    const size: number = parseInt(req.params.limit, 10) || 0;
    const q: any = req.query;
    const filter: any = {};
    let count: number = 0;
    let skip: number = (page - 1) * size || 0;
    let resources: T[];

    if (err) {
      return next(err);
    }

    // Check skip and limit are numbers
    if (isNaN(page) || isNaN(size)) {
      return next(new BadRequest("page or size must be a number"));
    }

    // Prevent negative skip
    if (skip < 0) {
      skip = 0;
    }

    // Construct filter from params
    Object.keys(q).forEach((key: string) => {
      filter[key] = q[key];
    });

    // Return resources
    try {
      if (res.locals.admin) {
        resources = await cont.findManyWithFilter(filter);
      } else {
        filter.userId = res.locals.user.id;
        resources = await cont.findManyWithFilter(filter, {
          limit: size,
          skip
        });
      }

      // get count
      count = await cont.getCount(filter);
    } catch (e) {
      return next(new InternalServerError(e.message));
    }

    return res.json(new Reply(200, "success", false, { count, resources }));
  }

  /**
   * Get a single resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public async show(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response> {
    let resource: T;
    const id: string = req.params.id;
    const routeSchema: RouterSchema = getSchema(req.originalUrl);
    const cont: IResourceRepository<T> = RepositoryFactory.getRepository(
      routeSchema.getTable()
    );
    const err: HttpError = BaseRouter.errorCheck(res);

    // Check error, override 403 if admin
    if (err) {
      if (err.httpStatus === HttpResponseCodes.Forbidden) {
        if (!res.locals.admin) {
          return next(err);
        }
      } else {
        return next(err);
      }
    }

    // Fetch resource
    try {
      resource = await cont.get(id);
    } catch (e) {
      return next(new InternalServerError(e.message));
    }

    // Throw 404 if not found
    if (!resource) {
      return next(new NotFound());
    }

    return res.json(new Reply(200, "success", false, resource));
  }

  /**
   * Search for a resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public async search(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response> {
    let resources: T[];
    const routeSchema: RouterSchema = getSchema(req.originalUrl);
    const cont: IResourceRepository<T> = RepositoryFactory.getRepository(
      routeSchema.getTable()
    );
    const err: HttpError = BaseRouter.errorCheck(res);
    const field = req.params.field;
    const term = req.params.term;
    const filter: any = {
      userId: res.locals.user.id
    };

    // Override 403
    if (err) {
      if (err.httpStatus === HttpResponseCodes.Forbidden) {
        if (!res.locals.admin) {
          return next(err);
        }
      } else {
        return next(err);
      }
    }

    // Fetch resources
    try {
      resources = await cont.search(field, term, filter);
    } catch (e) {
      return next(new InternalServerError(e.message));
    }

    return res.json(new Reply(200, "success", false, resources));
  }

  /**
   * Update resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response>}
   */
  public async update(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response> {
    const routeSchema: RouterSchema = getSchema(req.originalUrl);
    const cont: IResourceRepository<T> = RepositoryFactory.getRepository(
      routeSchema.getTable()
    );
    let resource: T;
    const data: any = {};
    const err: HttpError = BaseRouter.errorCheck(res);

    // Override 403 if admin
    if (err) {
      if (err.httpStatus === HttpResponseCodes.Forbidden) {
        if (!res.locals.admin) {
          return next(err);
        }
      } else {
        return next(err);
      }
    }

    // Create update object
    Object.keys(req.body).forEach((key: string) => {
      if (key === "_id") {
        return;
      }
      data[key] = req.body[key];
    });

    // Update resource
    try {
      resource = await cont.edit(req.body.id || req.body._id, data);
    } catch (e) {
      // Throw db error
      return next(new InternalServerError(e.message));
    }

    return res.json(new Reply(200, "success", false, resource));
  }

  /**
   * Set the router
   *
   * @param {e.Router} router
   */
  public setRouter(router: e.Router): void {
    this.router = router;
  }
}
