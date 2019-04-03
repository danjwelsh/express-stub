import * as HttpError from "http-errors";
import * as jwt from "jsonwebtoken";
import CryptoHelper from "../CryptoHelper";
import { HttpResponseCodes } from "../HttpResponseCodes";
import { IResourceRepository } from "../repositories/IResourceRepository";
import RepositoryFactory from "../repositories/RepositoryFactory";
import { IUser } from "../schemas/IUser";

export default class AuthController {
  /**
   * Authenticate a user
   * @param  username username
   * @param  password password
   * @return {IMongoUser} Matched user
   */
  public async authenticateUser(
    username: string,
    password: string
  ): Promise<IUser> {
    const userRepository: IResourceRepository<
      IUser
    > = RepositoryFactory.getRepository("user");
    let user: IUser;
    try {
      user = await userRepository.findOneWithFilter({ username });
    } catch (error) {
      throw HttpError(HttpResponseCodes.InternalServerError, error.message);
    }

    if (!user) {
      throw HttpError(HttpResponseCodes.Unauthorized);
    }

    const hashedPassword: string = CryptoHelper.hashString(password, user.iv);

    // Compare passwords and abort if no match
    if (user.password !== hashedPassword) {
      throw HttpError(
        HttpResponseCodes.Unauthorized,
        "Username or password is incorrect."
      );
    }

    return user;
  }

  /**
   * Create a JWT token for the user
   * @param  user IMongoUser
   * @return
   */
  public generateToken(user: IUser): string {
    const payload = {
      id: user._id,
      username: user.username
    };
    // create and sign token against the app secret
    return jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1 day" // expires in 24 hours
    });
  }
}
