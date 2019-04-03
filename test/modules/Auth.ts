import axios, { AxiosResponse } from "axios";
import { expect } from "chai";
import { describe } from "mocha";
import { IResourceRepository } from "../../web/repositories/IResourceRepository";
import RepositoryFactory from "../../web/repositories/RepositoryFactory";
import { IUser } from "../../web/schemas/IUser";
import { App } from "../../web/Server";
import { getUrl } from "../Commons";

describe("Auth", () => {
  let app: App;
  let user: IUser;
  let userRepository: IResourceRepository<IUser>;
  const port: number = 9897;

  before(async () => {
    app = new App();
    await app.initialiseServer();
    app.startServer(port);

    userRepository = RepositoryFactory.getRepository("user");
  });

  after(async () => {
    await userRepository.destroy(user._id);
    await app.tearDownServer();
  });

  describe("Register", () => {
    it("Should register a user and return a token", async () => {
      const userData = {
        password: "secret",
        username: "tester-auth"
      };
      const response: AxiosResponse = await axios.post(
        `${getUrl(port)}/api/auth/register`,
        userData
      );
      expect(response.data.payload.token).to.have.length.above(10);
      user = response.data.payload.user;
    });

    it("Should prevent the user from creating an account with an existing username", async () => {
      const userData = {
        password: "secret",
        username: "tester-auth"
      };

      try {
        await axios.post(`${getUrl(port)}/api/auth/register`, userData);
      } catch (error) {
        expect(error.response.status).to.equal(403);
      }
    });
  });

  describe("Authenticate", () => {
    it("Should return a JWT token", async () => {
      const userData = {
        password: "secret",
        username: "tester-auth"
      };

      const response: AxiosResponse = await axios.post(
        `${getUrl(port)}/api/auth/authenticate`,
        userData
      );
      expect(response.data.payload.token).to.have.length.above(10);
    });

    it("Should reject request if invalid password is given", async () => {
      const userData = {
        password: "password",
        username: "tester-auth"
      };

      try {
        await axios.post(`${getUrl(port)}/api/auth/authenticate`, userData);
      } catch (error) {
        expect(error.response.status).to.equal(401);
      }
    });

    it("Should reject request if invalid username is given", async () => {
      const userData = {
        password: "secret",
        username: "tester-auth-1"
      };

      try {
        await axios.post(`${getUrl(port)}/api/auth/authenticate`, userData);
      } catch (error) {
        expect(error.response.status).to.equal(401);
      }
    });
  });
});
