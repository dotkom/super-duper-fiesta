import { ADMIN_LOGIN, AUTH_SIGNED_OUT, AUTH_REGISTER } from '../../../common/actionTypes/auth';

export const register = (pin, passwordHash) => ({
  type: AUTH_REGISTER,
  pin,
  passwordHash,
});

export const signOut = () => ({
  type: AUTH_SIGNED_OUT,
});

export const adminLogin = password => ({
  type: ADMIN_LOGIN,
  password,
});
