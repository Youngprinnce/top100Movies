import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import authService from '../src/api/v1/components/auth/auth.service';
import authRepository from '../src/api/v1/components/auth/auth.service';
import * as utils from '../src/utils/helpers';
import * as tokenAuth from '../src/api/middlewares/auth';

describe('AuthService', () => {
  describe('signup', () => {
    it('should hash the password, call authRepository.signup, and return the response', async () => {
      const userData: any = {
        "firstName": "John",
        "lastName": "Doe",
        "password": "Password1!",
        "email": "johndoree@gmail.com"
      };
      const password = 'testpassword';
      const hashedPassword = 'hashedpassword';

      const bcryptHashStub = sinon.stub(bcrypt, 'hash').resolves(hashedPassword);
      const authRepositorySignupStub = sinon.stub(authRepository, 'signup');
      const responseDataStub = sinon.stub(utils, 'responseData').returns({
        message: "Registration successful",
        success: true,
        status: 201
      });

      await authService.signup({ userData });

      expect(bcryptHashStub.calledWith(password, 12)).to.be.true;
      expect(authRepositorySignupStub.calledWith({ userData: { ...userData, password: hashedPassword } })).to.be.true;
      expect(responseDataStub.calledWith(/* Expected response data */)).to.be.true;

      bcryptHashStub.restore();
      authRepositorySignupStub.restore();
      responseDataStub.restore();
    });

    it('should throw a BadRequestError if an error occurs', async () => {
      const userData: any = {
        "firstName": "John",
        "lastName": "Doe",
        "password": "Password1!",
        "email": "johndoree@gmail.com"
      };
      const password = 'testpassword';

      const error = new Error('Test error');
      const bcryptHashStub = sinon.stub(bcrypt, 'hash').throws(error);
      const responseDataStub = sinon.stub(utils, 'responseData');

      try {
        await authService.signup({ userData });
        expect.fail('Expected an error to be thrown.');
      } catch (err:any) {
        expect(err.name).to.equal('BadRequestError');
        expect(err.message).to.equal(error.message);
      }

      expect(bcryptHashStub.calledWith(password, 12)).to.be.true;
      expect(responseDataStub.notCalled).to.be.true;

      bcryptHashStub.restore();
      responseDataStub.restore();
    });
  });

  describe('login', () => {
    it('should call authRepository.findOneUser, compare passwords, sign access token, remove password from the user object, and return the response', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const user = {
        "password": "Password1!",
        "email": "johndoree@gmail.com"
      };
      const accessToken = 'mockaccesstoken';

      const authRepositoryFindOneUserStub = sinon.stub(authRepository, 'login').resolves();
      const bcryptCompareStub = sinon.stub(bcrypt, 'compare').resolves(true);
      const tokenAuthSignAccessTokenStub = sinon.stub(tokenAuth, 'signAccessToken').resolves(accessToken);
      const responseDataStub = sinon.stub(utils, 'responseData').returns({
        message: "Registration successful",
        success: true,
        status: 201
      });

      await authService.login({ email, password });

      expect(authRepositoryFindOneUserStub.calledWith({  })).to.be.true;
      expect(bcryptCompareStub.calledWith(password, user.password)).to.be.true;
      expect(tokenAuthSignAccessTokenStub.calledWith({ userId: '1' })).to.be.true;
      expect(responseDataStub.calledWith(/* Expected response data */)).to.be.true;

      authRepositoryFindOneUserStub.restore();
      bcryptCompareStub.restore();
      tokenAuthSignAccessTokenStub.restore();
      responseDataStub.restore();
    });

    it('should throw a BadRequestError if an error occurs during login', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      const error = new Error('Test error');
      const authRepositoryFindOneUserStub = sinon.stub(authRepository, 'login').throws(error);
      const responseDataStub = sinon.stub(utils, 'responseData');

      try {
        await authService.login({ email, password });
        expect.fail('Expected an error to be thrown.');
      } catch (err:any) {
        expect(err.name).to.equal('BadRequestError');
        expect(err.message).to.equal(error.message);
      }

      expect(authRepositoryFindOneUserStub.calledWith({  })).to.be.true;
      expect(responseDataStub.notCalled).to.be.true;

      authRepositoryFindOneUserStub.restore();
      responseDataStub.restore();
    });

    it('should throw a BadRequestError if the user does not exist', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      const authRepositoryFindOneUserStub = sinon.stub(authRepository, 'login').resolves();
      const responseDataStub = sinon.stub(utils, 'responseData');

      try {
        await authService.login({ email, password });
        expect.fail('Expected an error to be thrown.');
      } catch (err:any) {
        expect(err.name).to.equal('BadRequestError');
        expect(err.message).to.equal("you're not yet a user, please signup");
      }

      expect(authRepositoryFindOneUserStub.calledWith({ })).to.be.true;
      expect(responseDataStub.notCalled).to.be.true;

      authRepositoryFindOneUserStub.restore();
      responseDataStub.restore();
    });

    it('should throw a BadRequestError if the password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const user = {

      };

      const authRepositoryFindOneUserStub = sinon.stub(authRepository, 'login').resolves();
      const bcryptCompareStub = sinon.stub(bcrypt, 'compare').resolves(false);
      const responseDataStub = sinon.stub(utils, 'responseData');

      try {
        await authService.login({ email, password });
        expect.fail('Expected an error to be thrown.');
      } catch (err:any) {
        expect(err.name).to.equal('BadRequestError');
        expect(err.message).to.equal('invalid credentials');
      }

      expect(authRepositoryFindOneUserStub.calledWith({  })).to.be.true;
      expect(bcryptCompareStub.calledWith(password, password)).to.be.true;
      expect(responseDataStub.notCalled).to.be.true;

      authRepositoryFindOneUserStub.restore();
      bcryptCompareStub.restore();
      responseDataStub.restore();
    });
  });
});
