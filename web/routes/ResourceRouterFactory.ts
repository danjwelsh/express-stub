import IResourceRouter from './IResourceRouter';
import ResourceRouter from './ResourceRouter';
import IBaseResource from "../schemas/IBaseResource";

export default class ResourceRouterFactory {
  public static getResourceRouter(table: string, options: {isProtected: boolean, isOwned: boolean}):
    IResourceRouter<IBaseResource | any> {
    switch (process.env.DB_TYPE) {
      case 'MONGO':
        return ResourceRouterFactory.getMongoResourceRouter(table, options);
      default:
        return ResourceRouterFactory.getMongoResourceRouter(table, options);
    }
  }

  private static getMongoResourceRouter(table: string, options: {isProtected: boolean, isOwned: boolean}) {
    return new ResourceRouter(table, options);
  }
}
