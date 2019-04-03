import { NextFunction, Request, Response } from "express";
import * as HttpErrors from "http-errors";
import AuthController from "../../controllers/AuthController";
import CryptoHelper from "../../CryptoHelper";
import { HttpMethods as Methods } from "../../HttpMethods";
import { HttpResponseCodes } from "../../HttpResponseCodes";
import { Reply } from "../../Reply";
import { IResourceRepository } from "../../repositories/IResourceRepository";
import RepositoryFactory from "../../repositories/RepositoryFactory";
import { IUser } from "../../schemas/IUser";
import { BaseRouter } from "../BaseRouter";

export class AuthRouter extends BaseRouter {
  /**
   * Add routes to the Auth Router.
   */
  constructor() {
    super();
    this.addRoute("/authenticate", Methods.POST, this.authenticateUser);
    this.addRoute("/register", Methods.POST, this.registerUser);
  }

  public async authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const authController: AuthController = new AuthController();
    // Get username and password from request
    const username: string = req.body.username;
    const password: string = req.body.password;

    let user: IUser;
    try {
      user = await authController.authenticateUser(username, password);
    } catch (error) {
      return next(error);
    }

    const token = authController.generateToken(user);

    const response = new Reply(200, "success", false, { token });
    return res.json(response);
  }

  public async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const authController: AuthController = new AuthController();
    // Get username and password
    const username: string = req.body.username;
    const password: string = req.body.password;
    const userRepository: IResourceRepository<
      IUser
    > = RepositoryFactory.getRepository("user");
    let user: IUser;

    // abort if either username or password are null
    if (!username || !password) {
      return next(
        HttpErrors(
          HttpResponseCodes.BadRequest,
          "username or password cannot be empty"
        )
      );
    }

    const iv: string = CryptoHelper.getRandomString(16);
    const hash: string = CryptoHelper.hashString(password, iv);

    try {
      user = await userRepository.store({ username, password: hash, iv });
    } catch (error) {
      if (error.message.indexOf("duplicate key error") > -1) {
        return next(HttpErrors(HttpResponseCodes.Forbidden, error.message));
      }
      return next(error);
    }

    const token = authController.generateToken(user);

    const response = new Reply(200, "success", false, { user, token });
    return res.json(response);
  }
}
