import {describe} from "mocha";
import {expect} from "chai";
import {User} from "../../web/schemas/mongo/User";
import {IResourceRepository} from "../../web/repositories/IResourceRepository";
import RepositoryFactory from "../../web/repositories/RepositoryFactory";
import CryptoHelper from "../../web/CryptoHelper";

describe('Resource', () => {
  const userRepository: IResourceRepository<User> = RepositoryFactory.getRepository('user');
  let user: User;

  after(async () => {
    await userRepository.destroy(user._id);
  })

  it('Should create a resource', async () => {
    const userData = {
      username: 'tester',
      password: 'secret',
      iv: CryptoHelper.getRandomString(16),
    };
    user = await userRepository.store(userData);
    expect(user.username).to.equal(userData.username);
  });

  it('Should get a resource', async () => {
    const storedUser: User = await userRepository.get(user._id);
    expect(storedUser._id.toString()).to.equal(user._id.toString());
  });

  it('Should update a resource', async () => {
    const newUsername = 'updated username'

    user = await userRepository.edit(user._id, {
      username: newUsername,
    })

    expect(user.username).to.equal(newUsername);
  });

  it('Should return a count of all resources', async () => {
    const count: number = await userRepository.getCount({username: user.username});
    expect(count).to.equal(1);
  });

  it('Should find resources matching a query', async () => {
    const users: User[] = await userRepository.findManyWithFilter({username: user.username});
    expect(users.length).to.equal(1);
    expect(users[0].username).to.equal(user.username);
  });

  it('Should find a resource matching a query', async () => {
    const result: User = await userRepository.findOneWithFilter({username: user.username});
    expect(result.username).to.equal(user.username);
  });

  it('Should delete a resource', async () => {
    await userRepository.destroy(user._id);
    const stored = await userRepository.get(user._id);
    expect(stored).to.be.null;
  });
})
