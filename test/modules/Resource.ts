import * as assert from "assert";
import { expect } from "chai";
import { describe } from "mocha";
import { Mongoose } from "mongoose";
import CryptoHelper from "../../web/CryptoHelper";
import { DatabaseFactory } from "../../web/DatabaseFactory";
import { DBType } from "../../web/DBType";
import { IResourceRepository } from "../../web/repositories/IResourceRepository";
import RepositoryFactory from "../../web/repositories/RepositoryFactory";
import { IUser } from "../../web/schemas/IUser";

/*
 * Test generic resources through the generic resource repository interface.
 */
describe("Resource", () => {
  let userRepository: IResourceRepository<IUser>;
  let user: IUser;
  let conn: Mongoose;

  before(async () => {
    conn = (await DatabaseFactory.getConnection(DBType.Mongo)) as Mongoose;
    userRepository = RepositoryFactory.getRepository("user");
  });

  after(async () => {
    await userRepository.destroy(user._id);
    await conn.disconnect();
  });

  it("Should create a resource", async () => {
    const userData = {
      iv: CryptoHelper.getRandomString(16),
      password: "secret",
      username: "tester"
    };
    user = await userRepository.store(userData);
    expect(user.username).to.equal(userData.username);
  });

  it("Should get a resource", async () => {
    const storedUser: IUser = await userRepository.get(user._id);
    expect(storedUser._id.toString()).to.equal(user._id.toString());
  });

  it("Should update a resource", async () => {
    const newUsername = "updated username";

    user = await userRepository.edit(user._id, {
      username: newUsername
    });

    expect(user.username).to.equal(newUsername);
  });

  it("Should return a count of all resources", async () => {
    const count: number = await userRepository.getCount({
      username: user.username
    });
    expect(count).to.equal(1);
  });

  it("Should find resources matching a query", async () => {
    const users: IUser[] = await userRepository.findManyWithFilter({
      username: user.username
    });
    expect(users.length).to.equal(1);
    expect(users[0].username).to.equal(user.username);
  });

  it("Should find a resource matching a query", async () => {
    const result: IUser = await userRepository.findOneWithFilter({
      username: user.username
    });
    expect(result.username).to.equal(user.username);
  });

  it("Should delete a resource", async () => {
    await userRepository.destroy(user._id);
    const stored = await userRepository.get(user._id);
    assert(stored === null || stored === undefined);
  });
});
