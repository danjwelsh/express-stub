import * as e from "express";
import { HttpMethods } from "../HttpMethods";
import { checkAdmin } from "../middleware/Admin";
import { checkToken } from "../middleware/Authenticate";
import { userPermission } from "../middleware/UserPermission";
import { BaseRouter } from "./BaseRouter";

export default abstract class BaseResourceRouter extends BaseRouter {
  public addDefaultRoutes(): void {
    this.addRoute("/:id", HttpMethods.GET, this.show);
    this.addRoute("/:id", HttpMethods.DELETE, this.destroy);
    this.addRoute("/:page/:limit", HttpMethods.GET, this.paged);
    this.addRoute("/search/:field/:term", HttpMethods.GET, this.search);
    this.addRoute("/update", HttpMethods.POST, this.update);
    this.addRoute("/", HttpMethods.POST, this.store);
    this.addRoute("/", HttpMethods.GET, this.index);
  }

  public insertMiddleware(options: {
    isProtected: boolean;
    isOwned: boolean;
  }): void {
    if (options != null && options.isProtected) {
      this.addMiddleware(checkToken);
      this.addMiddleware(userPermission);
    }

    this.addMiddleware(checkAdmin);
    this.addDefaultRoutes();
  }

  public abstract show(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response>;

  public abstract destroy(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response>;

  public abstract paged(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response>;

  public abstract search(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response>;

  public abstract update(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response>;

  public abstract store(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response>;

  public abstract index(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction
  ): Promise<void | e.Response>;
}
