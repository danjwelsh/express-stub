import { expect } from "chai";
import { Mongoose, Schema } from "mongoose";
import CryptoHelper from "../../web/CryptoHelper";
import { DatabaseFactory } from "../../web/DatabaseFactory";
import { getModel } from "../../web/Models";
import { MongoResourceRepository } from "../../web/repositories/MongoResourceRepository";
import { IUser } from "../../web/schemas/IUser";
import { IMongoUser } from "../../web/schemas/mongo/IMongoUser";
import { UserRole } from "../../web/UserRole";

/*
 * Unit test the MongoResourceRepository
 */
describe("MongoResourceRepository.ts", () => {
  let connection: Mongoose;
  let user: IMongoUser;
  let userRepository: MongoResourceRepository<IMongoUser>;

  /*
   * Get a connection to the database.
   */
  before(async () => {
    connection = await DatabaseFactory.getMongoConnection();
    userRepository = new MongoResourceRepository<IMongoUser>();
    userRepository.setTableName("user");
  });

  /*
   * Destroy the connection
   */
  after(async () => {
    await userRepository.destroy(user._id as Schema.Types.ObjectId);
    await connection.disconnect();
  });

  it("Should store a resource", async () => {
    const userData = {
      iv: CryptoHelper.getRandomString(16),
      password: "password",
      role: UserRole.USER,
      username: "test-repo"
    };
    user = await userRepository.store(userData);

    expect(user.username).to.equal(userData.username);
  });

  it("Should update a resource", async () => {
    user.username = "updated-username";
    const updateData = {
      _id: user._id,
      iv: user.iv,
      password: user.password,
      username: user.username
    };
    const updated: IUser = await userRepository.edit(
      user._id as Schema.Types.ObjectId,
      updateData
    );

    expect(updated.username).to.equal("updated-username");
  });

  it("Should get all resources from the table", async () => {
    const count: number = await getModel("user")
      .find({})
      .count();
    const results: IUser[] = await userRepository.getAll();

    expect(results.length).to.equal(count);
  });

  it("Should find many resources matching the same search criteria", async () => {
    const results: IUser[] = await userRepository.findManyWithFilter({
      password: "password"
    });
    results.forEach((u: IUser) => {
      expect(u.password).to.equal("password");
    });
  });

  it("Should find one resource matching the same search criteria", async () => {
    const result: IUser = await userRepository.findOneWithFilter({
      password: "password"
    });
    expect(result.password).to.equal("password");
  });

  it("Should get a count of all resources in the table", async () => {
    const expectedCount: number = await getModel("user")
      .find({})
      .count();
    const count: number = await userRepository.getCount({});

    expect(expectedCount).to.equal(count);
  });
});
