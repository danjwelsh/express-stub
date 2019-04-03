import * as e from "express";
import * as HttpErrors from "http-errors";
import { HttpError } from "http-errors";
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

export default class ResourceRouter<T extends IBaseResource>
  extends BaseResourceRouter
  implements IResourceRouter<IBaseResource> {
  constructor(
    table: string,
    options: { isProtected: boolean; isOwned: boolean }
  ) {
    super();
    this.insertMiddleware(options);
  }

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
    const err: HttpError = BaseRouter.errorCheck(res);

    if (err) {
      return next(err);
    }

    Object.keys(req.body).forEach((key: string) => {
      data[key] = req.body[key];
    });

    if (routeSchema.getOptions().isOwned) {
      data.userId = userId;
    }

    try {
      resource = await cont.store(data);
    } catch (e) {
      return next(HttpErrors(HttpResponseCodes.InternalServerError, e.message));
    }

    return res.json(new Reply(200, "success", false, resource));
  }

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

    if (err) {
      return next(err);
    }

    try {
      await cont.destroy(id);
      if (routeSchema.getOptions().isOwned) {
        // remove from user.
        user = await userRepo.get(res.locals.user.id);
        const resourceList: Array<
          Schema.Types.ObjectId | number
        > = await user.getLinkedCollection(routeSchema.getTable());
        const idx: number = resourceList.findIndex(
          resource => `${resource}` === id
        );
        resourceList.splice(idx, 1);
        await user.setLinkedCollection(resourceList, routeSchema.getTable());
        await userRepo.edit(user.getId(), user.toJSONObject());
      }
    } catch (e) {
      return next(HttpErrors(HttpResponseCodes.InternalServerError, e.message));
    }

    return res.json(new Reply(200, "success", false, {}));
  }

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

    Object.keys(q).forEach((key: string) => {
      filter[key] = q[key];
    });

    if (err) {
      return next(err);
    }

    try {
      if (res.locals.admin) {
        resources = await cont.getAll();
      } else {
        filter.userId = res.locals.user.id;
        resources = await cont.findManyWithFilter(filter);
      }
    } catch (e) {
      return next(HttpErrors(HttpResponseCodes.InternalServerError, e.message));
    }

    return res.json(new Reply(200, "success", false, resources));
  }

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

    if (skip < 0) {
      skip = 0;
    }

    Object.keys(q).forEach((key: string) => {
      filter[key] = q[key];
    });

    if (isNaN(page) || isNaN(size)) {
      return next(
        HttpErrors(
          HttpResponseCodes.BadRequest,
          "page or size must be a number"
        )
      );
    }

    if (err) {
      return next(err);
    }

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

      count = await cont.getCount(filter);
    } catch (e) {
      return next(HttpErrors(HttpResponseCodes.InternalServerError, e.message));
    }

    return res.json(new Reply(200, "success", false, { count, resources }));
  }

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

    if (err) {
      if (err.status === 403) {
        if (!res.locals.admin) {
          return next(err);
        }
      } else {
        return next(err);
      }
    }

    try {
      resource = await cont.get(id);
    } catch (e) {
      return next(HttpErrors(HttpResponseCodes.InternalServerError, e.message));
    }

    if (!resource) {
      return next(HttpErrors(HttpResponseCodes.NotFound));
    }

    return res.json(new Reply(200, "success", false, resource));
  }

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

    filter[field] = { $regex: `${term}` };

    if (err) {
      if (err.status === 403) {
        if (!res.locals.admin) {
          return next(err);
        }
      } else {
        return next(err);
      }
    }

    try {
      resources = await cont.findManyWithFilter(filter);
    } catch (e) {
      return next(HttpErrors(HttpResponseCodes.InternalServerError, e.message));
    }

    return res.json(new Reply(200, "success", false, resources));
  }

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

    if (err) {
      if (err.status === 403) {
        if (!res.locals.admin) {
          return next(err);
        }
      } else {
        return next(err);
      }
    }

    Object.keys(req.body).forEach((key: string) => {
      if (key === "_id") {
        return;
      }
      data[key] = req.body[key];
    });

    try {
      resource = await cont.edit(req.body.id || req.body._id, data);
    } catch (e) {
      return next(HttpErrors(HttpResponseCodes.InternalServerError, e.message));
    }

    return res.json(new Reply(200, "success", false, resource));
  }

  public setRouter(router: e.Router): void {
    this.router = router;
  }
}
