import { BadRequest, Forbidden } from "@curveball/http-errors";
import { NextFunction, Request, Response } from "express";
import AuthController from "../../controllers/AuthController";
import CryptoHelper from "../../CryptoHelper";
import { HttpMethods as Methods } from "../../HttpMethods";
import { Reply } from "../../Reply";
import { IResourceRepository } from "../../repositories/IResourceRepository";
import RepositoryFactory from "../../repositories/RepositoryFactory";
import { IUser } from "../../schemas/IUser";
import { BaseRouter } from "../BaseRouter";

/**
 * AuthRouter
 *
 * Handles authentication routes.
 */
export class AuthRouter extends BaseRouter {
  /**
   * Add routes to the Auth Router.
   */
  constructor() {
    super();
    this.addRoute("/authenticate", Methods.POST, this.authenticateUser);
    this.addRoute("/register", Methods.POST, this.registerUser);
  }

  /**
   * Authenticate the user against email and password
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
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

    // Try to authenticate
    try {
      user = await authController.authenticateUser(username, password);
    } catch (error) {
      // Throw auth errors
      return next(error);
    }

    // Generate a token
    const token = authController.generateToken(user);

    // Return token
    const response = new Reply(200, "success", false, { token });
    return res.json(response);
  }

  /**
   * Register the user
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @param {e.NextFunction} next
   * @returns {Promise<e.Response | void>}
   */
  public async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const authController: AuthController = new AuthController();
    // Get username and password
    const username: string = req.body.username;
    const password: string = req.body.password;
    const iv: string = CryptoHelper.getRandomString(16);
    const userRepository: IResourceRepository<
      IUser
    > = RepositoryFactory.getRepository("user");
    let user: IUser;

    // abort if either username or password are null
    if (!username || !password) {
      return next(new BadRequest("username or password cannot be empty"));
    }

    // Generate the hashed password
    const hash: string = CryptoHelper.hashString(password, iv);

    // Store the user
    try {
      user = await userRepository.store({ username, password: hash, iv });
    } catch (error) {
      // If user name already exists throw 403
      if (error.message.indexOf("duplicate key error") > -1) {
        return next(new Forbidden(error.message));
      }
      return next(error);
    }

    // Generate token
    const token = authController.generateToken(user);

    // Return new user and token
    const response = new Reply(200, "success", false, { user, token });
    return res.json(response);
  }
}
