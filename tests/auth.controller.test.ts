import { expect } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import controller from '../src/api/v1/components/auth/auth.controller';
import authService from '../src/api/v1/components/auth/auth.service';

describe('Controller', () => {
  describe('signup', () => {
    it('should call authService.signup and return the response', async () => {
      const req:any = {
        body: {
          "firstName": "John",
          "lastName": "Doe",
          "password": "Password1!",
          "email": "johndoree@gmail.com"
        },
      };
      const res:any = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const authServiceSignupStub = sinon.stub(authService, 'signup').resolves({
        message: "Registration successful",
        success: true,
        status: 201
      });

      await controller.signup(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith(/* Expected response data */)).to.be.true;
      expect(next.notCalled).to.be.true;

      authServiceSignupStub.restore();
    })

    it('should call next with an error if authService.signup throws an error', async () => {
      const req:any = {
        body: {
          "firstName": "John",
          "lastName": "Doe",
          "password": "Password1!",
          "email": "johndoree@gmail.com"
        },
      };
      const res:any = {
        status: sinon.stub(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const error = new Error('Test error');
      const authServiceSignupStub = sinon.stub(authService, 'signup').throws(error);

      await controller.signup(req, res, next);

      expect(res.status.notCalled).to.be.true;
      expect(res.json.notCalled).to.be.true;
      expect(next.calledWith(error)).to.be.true;

      authServiceSignupStub.restore();
    });
  });

  describe('login', () => {
    it('should call authService.login and return the response', async () => {
      const req:any = {
        body: {
          email: 'test@example.com',
          password: 'testpassword',
        },
      };
      const res:any = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const authServiceLoginStub = sinon.stub(authService, 'login').resolves({
        message: "Registration successful",
        success: true,
        status: 201
      });

      await controller.login(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith(/* Expected response data */)).to.be.true;
      expect(next.notCalled).to.be.true;

      authServiceLoginStub.restore();
    });

    it('should call next with an error if authService.login throws an error', async () => {
      const req:any = {
        body: {
          email: 'test@example.com',
          password: 'testpassword',
        },
      };
      const res:any = {
        status: sinon.stub(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const error = new Error('Test error');
      const authServiceLoginStub = sinon.stub(authService, 'login').throws(error);

      await controller.login(req, res, next);

      expect(res.status.notCalled).to.be.true;
      expect(res.json.notCalled).to.be.true;
      expect(next.calledWith(error)).to.be.true;

      authServiceLoginStub.restore();
    });
  });
});
