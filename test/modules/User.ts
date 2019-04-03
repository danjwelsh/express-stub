import axios, { AxiosResponse } from "axios";
import { expect } from "chai";
import { describe } from "mocha";
import AuthController from "../../web/controllers/AuthController";
import { IResourceRepository } from "../../web/repositories/IResourceRepository";
import RepositoryFactory from "../../web/repositories/RepositoryFactory";
import { IUser } from "../../web/schemas/IUser";
import { App } from "../../web/Server";
import { getUrl } from "../Commons";

/*
 * Test user endpoints
 * TODO: expand to test all resource endpoints as an integration test.
 */
describe("User", () => {
  let userRepository: IResourceRepository<IUser>;
  let authController: AuthController;
  let user: IUser;
  let token: string;
  let app: App;
  const port: number = 9896;

  before(async () => {
    app = new App();
    await app.initialiseServer();
    app.startServer(port);

    userRepository = RepositoryFactory.getRepository("user");
    authController = new AuthController();

    const username: string = "tester-user";
    const password: string = "secret";

    user = await userRepository.store({ username, password, iv: "12345678" });
    token = await authController.generateToken(user);
  });

  after(async () => {
    await app.tearDownServer();
  });

  describe("Profile", () => {
    it("Should return the users information", async () => {
      const response: AxiosResponse = await axios.get(
        `${getUrl(port)}/api/user/${user._id}`,
        { headers: { "x-access-token": token } }
      );
      expect(response.data.payload.username).to.equal("tester-user");
    });

    it("Should delete users profile", async () => {
      const response = await axios.delete(
        `${getUrl(port)}/api/user/${user._id}`,
        { headers: { "x-access-token": token } }
      );
      expect(response.status).to.equal(200);
    });
  });
});
