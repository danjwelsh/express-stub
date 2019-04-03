import { expect } from "chai";
import "reflect-metadata";
import { Connection, getManager } from "typeorm";
import CryptoHelper from "../../web/CryptoHelper";
import { DatabaseFactory } from "../../web/DatabaseFactory";
import { IResourceRepository } from "../../web/repositories/IResourceRepository";
import { MySQLResourceRepository } from "../../web/repositories/MySQLResourceRepository";
import { IUser } from "../../web/schemas/IUser";
import { User } from "../../web/schemas/mysql/User";
import { UserRole } from "../../web/UserRole";

/*
 * Unit test the MySQLResourceRepository
 */
describe("MySQLResourceRepository", () => {
  let connection: Connection;
  let user: IUser;
  let user2: IUser;

  /*
   * Connect to the MySQL db.
   */
  before(async () => {
    connection = await DatabaseFactory.getMySQLConnection();
    const userRepository: IResourceRepository<
      IUser
    > = new MySQLResourceRepository<User>(User);
    user2 = await userRepository.store({
      iv: CryptoHelper.getRandomString(16),
      password: "password",
      role: UserRole.USER,
      username: "test-repo-2"
    });
  });

  /*
   * Remove stored resources and destroy connection.
   */
  after(async () => {
    const userRepository: IResourceRepository<
      IUser
    > = new MySQLResourceRepository<User>(User);
    await userRepository.destroy(user._id);
    await userRepository.destroy(user2._id);
    await connection.close();
  });

  it("Should store a resource", async () => {
    const userRepository: IResourceRepository<
      IUser
    > = new MySQLResourceRepository<User>(User);
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
    const userRepository: IResourceRepository<
      IUser
    > = new MySQLResourceRepository<User>(User);
    user.username = "updated-username";
    const updateData = {
      _id: user._id,
      iv: user.iv,
      password: user.password,
      username: user.username
    };
    const updated: IUser = await userRepository.edit(user._id, updateData);

    expect(updated.username).to.equal("updated-username");
  });

  it("Should get all resources from the table", async () => {
    const count: number = await getManager()
      .getRepository("user")
      .count();
    const userRepository: IResourceRepository<
      IUser
    > = new MySQLResourceRepository<User>(User);
    const results: IUser[] = await userRepository.getAll();

    expect(results.length).to.equal(count);
  });

  it("Should find many resources matching the same search criteria", async () => {
    const userRepository: IResourceRepository<
      IUser
    > = new MySQLResourceRepository<User>(User);
    userRepository.setTableName("user");

    const results: IUser[] = await userRepository.findManyWithFilter({
      password: "password"
    });
    results.forEach((u: IUser) => {
      expect(u.password).to.equal("password");
    });
  });

  it("Should find one resource matching the same search criteria", async () => {
    const userRepository: IResourceRepository<
      IUser
    > = new MySQLResourceRepository<User>(User);
    userRepository.setTableName("user");

    const result: IUser = await userRepository.findOneWithFilter({
      password: "password"
    });
    expect(result.password).to.equal("password");
  });

  it("Should get a count of all resources in the table", async () => {
    const userRepository: IResourceRepository<
      IUser
    > = new MySQLResourceRepository<User>(User);
    userRepository.setTableName("user");

    const expectedCount: number = await getManager()
      .getRepository("user")
      .count();
    const count: number = await userRepository.getCount({});

    expect(expectedCount).to.equal(count);
  });
});
