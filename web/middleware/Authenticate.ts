import * as express from "express";
import * as HttpErrors from "http-errors";
import * as jwt from "jsonwebtoken";
import { IUser } from "../schemas/IUser";
import { HttpResponseCodes } from "../HttpResponseCodes";

export function checkToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token: string =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.params.token;

  if (token) {
    jwt.verify(token, process.env.SECRET, (err: Error, user: IUser) => {
      if (err) {
        res.locals.customErrorMessage = "invalid token";
        res.locals.error = HttpErrors(
          HttpResponseCodes.Unauthorized,
          "invalid token"
        );
        return next();
      } else {
        res.locals.user = user;
        return next();
      }
    });
  } else {
    res.locals.customErrorMessage = "token not provided";
    res.locals.error = HttpErrors(
      HttpResponseCodes.Unauthorized,
      "token not provided"
    );
    return next();
  }
}
