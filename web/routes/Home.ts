import {NextFunction, Request, Response} from 'express'
import {BaseRouter} from "./BaseRouter";
import {HttpMethods} from "../HttpMethods";

export class HomeRouter extends BaseRouter {
  constructor() {
    super();
    this.addRoute('/', HttpMethods.GET, this.showHome);
  }

  showHome(req: Request, res: Response, next: NextFunction): Response {
    return res.send('Hello World');
  }
}
