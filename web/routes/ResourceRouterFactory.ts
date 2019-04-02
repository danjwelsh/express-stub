import IBaseResource from "../schemas/IBaseResource";
import IResourceRouter from "./IResourceRouter";
import ResourceRouter from "./ResourceRouter";

export default class ResourceRouterFactory {
  public static getResourceRouter(
    table: string,
    options: { isProtected: boolean; isOwned: boolean }
  ): IResourceRouter<IBaseResource | any> {
    return new ResourceRouter(table, options);
  }
}
