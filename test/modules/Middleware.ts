import { describe } from 'mocha';
import axios, { AxiosError } from 'axios';
import { URL } from '../Commons';
import { expect } from 'chai';
import { User } from '../../web/schemas/mongo/User';
import AuthController from '../../web/controllers/AuthController';
import { IResourceRepository } from '../../web/repositories/IResourceRepository';
import RepositoryFactory from '../../web/repositories/RepositoryFactory';
import CryptoHelper from '../../web/CryptoHelper';

const userRepository: IResourceRepository<User> = RepositoryFactory.getRepository('user');
const authController: AuthController = new AuthController();

let user: User;
let token: string;

describe('Middleware', () => {
  before(async () => {
    const username: string = 'tester-middleware';
    const password: string  = 'secret';

    user = await userRepository.store({ username, password, iv: CryptoHelper.getRandomString(16) });
    token = await authController.generateToken(user);
  });

  after(async () => {
    await userRepository.destroy(user._id);
  });

  describe('Authentication', () => {
    describe('Require token', () => {
      it('Should reject request if no token is given', async () => {
        try {
          await axios.get(`${URL}/api/user/${user._id}`);
        } catch (error) {
          expect(error.response.status).to.equal(401);
        }
      });

      it('Should reject request if the token is invalid', async () => {
        const invToken = `${token}0`;
        try {
          await axios.get(`${URL}/api/user/${user._id}`, { headers: { 'x-access-token': invToken } });
        } catch (error) {
          expect(error.response.status).to.equal(401);
        }
      });
    });
  });
});
