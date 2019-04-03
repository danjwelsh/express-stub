import { NextFunction, Request, Response } from "express";
import { HttpMethods } from "../HttpMethods";
import { BaseRouter } from "./BaseRouter";

export class HomeRouter extends BaseRouter {
  constructor() {
    super();
    this.addRoute("/", HttpMethods.GET, this.showHome);
  }

  public showHome(req: Request, res: Response, next: NextFunction): Response {
    return res.send("Hello World");
  }
}
