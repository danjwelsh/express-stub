import { NextFunction, Request, Response, Router } from "express";
import IBaseResource from "../schemas/IBaseResource";

/**
 * ResourceRouter interface.
 *
 * All resource routers must implement this interface.
 */
export default interface IResourceRouter<T extends IBaseResource> {
  /**
   * Store the resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  store(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> | void;

  /**
   * Get all resources
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> | void;

  /**
   * Get a single resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  show(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> | void;

  /**
   * Search resources
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  search(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> | void;

  /**
   * Pagination for get all
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  paged(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> | void;

  /**
   * Update a resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> | void;

  /**
   * Delete a resource
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<void | e.Response> | void}
   */
  destroy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> | void;

  /**
   * Add default routes to the router
   */
  addDefaultRoutes(): void;

  /**
   * Set the resource router
   *
   * @param {e.Router} router
   */
  setRouter(router: Router): void;

  /**
   * Get the resource router
   *
   * @returns {e.Router}
   */
  getRouter(): Router;
}
