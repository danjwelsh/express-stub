import IBaseResource from "../schemas/IBaseResource";
import IResourceRouter from "./IResourceRouter";
import ResourceRouter from "./ResourceRouter";

/**
 * Resource Router Factory
 *
 * Get a resource router, extend to add custom resource routers
 */
export default class ResourceRouterFactory {
  public static getResourceRouter(
    table: string,
    options: { isProtected: boolean; isOwned: boolean }
  ): IResourceRouter<IBaseResource | any> {
    return new ResourceRouter(table, options);
  }
}
