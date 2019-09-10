import * as store from 'common/store';
import { UserModel } from '../user_model';

/* eslint-disable no-unused-expressions */
function initUserModel(login) {
  const userModel = new UserModel();
  return userModel._init.then(() => {
    if (login) {
      return userModel
        .logIn({
          isLoggedIn: true,
          secret: '123',
          email: '123@123.com',
          password: '123@123.com',
          name: '123',
          surname: '123',
        })
        .then(() => userModel);
    }
    return userModel;
  });
}

describe('User Model', () => {
  let getStoreStub;
  let server;

  before(() => {
    getStoreStub = sinon.stub(store, 'getStore').resolves({
      getItem: () => Promise.resolve('{}'),
      setItem: () => Promise.resolve(),
    });
  });

  after(() => {
    getStoreStub.restore();
  });

  beforeEach(() => {
    server = sinon.fakeServer.create();
    return initUserModel().then(userModel => {
      userModel.resetDefaults();
    });
  });

  afterEach(() =>
    initUserModel().then(userModel => {
      userModel.resetDefaults();
      server.restore();
    })
  );

  it('has default values', () => {
    const userModel = new UserModel();
    expect(userModel.get('drupalID')).to.be.equal(null);
    expect(userModel.get('name')).to.be.equal(null);
    expect(userModel.get('firstname')).to.be.equal(null);
    expect(userModel.get('secondname')).to.be.equal(null);
    expect(userModel.get('email')).to.be.equal(null);
    expect(userModel.get('password')).to.be.equal(null);
  });
});
