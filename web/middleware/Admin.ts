import ControllerFactory from '../repositories/RepositoryFactory';
import { IResourceRepository } from '../repositories/IResourceRepository';
import { IUser } from '../schemas/IUser';
import { UserRole } from '../UserRole';
import { NextFunction, Request, Response } from 'express';

/**
 * Verfiy a user's JWT token
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export function checkAdmin() {

  return (req: Request, res: Response, next: NextFunction) => {
    const userRepository: IResourceRepository<IUser> = ControllerFactory.getRepository('user');
    if (res.locals.error) {
      if (!(res.locals.error === 403)) return next();
    }

    userRepository.get(res.locals.user.id)
      .then((user: IUser) => {
        if (user.role === UserRole.ADMIN) {
          res.locals.admin = UserRole.ADMIN;
        }
        return next();
      })
      .catch((e) => {
        res.locals.customErrorMessage = e.message;
        res.locals.error = 500;
        return next();
      });
  };
}
