import { describe } from 'mocha';
import axios, { AxiosResponse } from 'axios';
import { URL } from '../Commons';
import { expect } from 'chai';
import AuthController from '../../web/controllers/AuthController';
import { IUser } from '../../web/schemas/User';
import { IResourceRepository } from '../../web/repositories/IResourceRepository';
import RepositoryFactory from '../../web/repositories/RepositoryFactory';

const userRepository: IResourceRepository<IUser> = RepositoryFactory.getRepository('user');
const authController: AuthController = new AuthController();

let user: IUser;
let token: string;

describe('User', () => {
  before(async () => {
    const username: string = 'tester-user';
    const password: string  = 'secret';

    user = await userRepository.store({ username, password, iv: '12345678' });
    token = await authController.generateToken(user);
  });

  describe('Profile', () => {
    it('Should return the users information', async () => {
      const response: AxiosResponse = await axios.get(`${URL}/api/user/${user._id}`, { headers: { 'x-access-token': token } })
      expect(response.data.payload.username).to.equal('tester-user');
    });

    it('Should delete users profile', async () => {
      const response = await axios.delete(`${URL}/api/user/${user._id}`, { headers: { 'x-access-token': token } })
      expect(response.status).to.equal(200);
    });
  });
});
