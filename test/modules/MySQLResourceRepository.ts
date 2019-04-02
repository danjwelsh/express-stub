import {DatabaseFactory} from "../../web/DatabaseFactory";
import {Connection, getManager} from "typeorm";
import 'reflect-metadata';
import {IResourceRepository} from "../../web/repositories/IResourceRepository";
import {IUser} from "../../web/schemas/IUser";
import CryptoHelper from "../../web/CryptoHelper";
import {UserRole} from "../../web/UserRole";
import {expect} from "chai";
import {MySQLResourceRepository} from "../../web/repositories/MySQLResourceRepository";
import {User} from "../../web/schemas/mysql/User";

describe('MySQLResourceRepository', () => {
  let connection: Connection;
  let user: IUser;
  let user2: IUser;

  before( async () => {
    connection = await DatabaseFactory.getMySQLConnection();
    const userRepository: IResourceRepository<IUser> = new MySQLResourceRepository<User>(User);
    user2 = await userRepository.store(
      {
        username: 'test-repo-2',
        password: 'password',
        iv: CryptoHelper.getRandomString(16),
        role: UserRole.USER,
      }
    );
  });

  after(async () => {
    const userRepository: IResourceRepository<IUser> = new MySQLResourceRepository<User>(User);
    await userRepository.destroy(user._id);
    await userRepository.destroy(user2._id);
    await connection.close();
  })

  it('Should store a resource', async () => {
    const userRepository: IResourceRepository<IUser> = new MySQLResourceRepository<User>(User);
    const userData = {
      username: 'test-repo',
      password: 'password',
      iv: CryptoHelper.getRandomString(16),
      role: UserRole.USER,
    }
    user = await userRepository.store(userData);

    expect(user.username).to.equal(userData.username);
  });

  it('Should update a resource', async () => {
    const userRepository: IResourceRepository<IUser> = new MySQLResourceRepository<User>(User);
    user.username = 'updated-username';
    const updateData = {
      _id: user._id,
      username: user.username,
      password: user.password,
      iv: user.iv,
    }
    const updated: IUser = await userRepository.edit(user._id, updateData);

    expect(updated.username).to.equal('updated-username');
  });

  it('Should get all resources from the table', async () => {
    const count: number = await getManager().getRepository('user').count();
    const userRepository: IResourceRepository<IUser> = new MySQLResourceRepository<User>(User);
    const results: IUser[] = await userRepository.getAll()

    expect(results.length).to.equal(count);
  });

  it('Should find many resources matching the same search criteria', async () => {
    const userRepository: IResourceRepository<IUser> = new MySQLResourceRepository<User>(User);
    userRepository.setTableName('user');

    const results: IUser[] = await userRepository.findManyWithFilter({password: 'password'});
    results.forEach((u: IUser) => {
      expect(u.password).to.equal('password');
    });
  });

  it('Should find one resource matching the same search criteria', async () => {
    const userRepository: IResourceRepository<IUser> = new MySQLResourceRepository<User>(User);
    userRepository.setTableName('user');

    const result: IUser = await userRepository.findOneWithFilter({password: 'password'});
    expect(result.password).to.equal('password');
  });

  it('Should get a count of all resources in the table', async () => {
    const userRepository: IResourceRepository<IUser> = new MySQLResourceRepository<User>(User);
    userRepository.setTableName('user');

    const expectedCount: number = await getManager().getRepository('user').count();
    const count: number = await userRepository.getCount({});

    expect(expectedCount).to.equal(count);
  });
})
