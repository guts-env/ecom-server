export const mockRegister = jest.fn().mockImplementation(() => {
  return Promise.resolve(undefined);
});

export const mockLogin = jest.fn().mockImplementation(() => {
  return Promise.resolve({});
});

export default class MockAuthService {
  register = mockRegister;
  login = mockLogin;

  constructor() {
    console.log('MockAuthService constructor called');
  }
}
