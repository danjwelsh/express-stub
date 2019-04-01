import { describe } from 'mocha';
import axios, { AxiosResponse } from 'axios';
import { URL } from '../Commons';
import { expect } from 'chai';
import { IUser } from '../../web/schemas/User';
import { IResourceRepository } from '../../web/repositories/IResourceRepository';
import RepositoryFactory from '../../web/repositories/RepositoryFactory';

let user: IUser;
const userRepository: IResourceRepository<IUser> = RepositoryFactory.getRepository('user');

describe('Auth', () => {
  after(async () => {
    await userRepository.destroy(user._id);
  });

  describe('Register', () => {
    it('Should register a user and return a token', async () => {
      const userData = {
        username: 'tester-auth',
        password: 'secret',
      };
      const response: AxiosResponse = await axios.post(`${URL}/api/auth/register`, userData);
      expect(response.data.payload.token).to.have.length.above(10);
      user = response.data.payload.user;
    });

    it('Should prevent the user from creating an account with an existing username', async () => {
      const userData = {
        username: 'tester-auth',
        password: 'secret',
      };

      try {
        await axios.post(`${URL}/api/auth/register`, userData)
      } catch (error) {
        expect(error.response.status).to.equal(403);
      }
    });
  });

  describe('Authenticate', () => {
    it('Should return a JWT token', async () => {
      const userData = {
        username: 'tester-auth',
        password: 'secret',
      };

      const response: AxiosResponse = await axios.post(`${URL}/api/auth/authenticate`, userData);
      expect(response.data.payload.token).to.have.length.above(10);
    });

    it('Should reject request if invalid password is given', async () => {
      const userData = {
        username: 'tester-auth',
        password: 'password',
      };

      try {
        await axios.post(`${URL}/api/auth/authenticate`, userData)
      } catch (error) {
        expect(error.response.status).to.equal(401);
      }
    });

    it('Should reject request if invalid username is given', async () => {
      const userData = {
        username: 'tester-auth-1',
        password: 'secret',
      };

      try {
        await axios.post(`${URL}/api/auth/authenticate`, userData);
      } catch (error) {
        expect(error.response.status).to.equal(401);
      }
    });
  });
});
