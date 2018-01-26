import { ADMIN_CREATE_GENFORS, ADMIN_LOGIN, AUTH_REGISTER } from 'common/actionTypes/auth';

export const register = (pin, passwordHash) => ({
  type: AUTH_REGISTER,
  pin,
  passwordHash,
});

export const adminLogin = password => ({
  type: ADMIN_LOGIN,
  password,
});

export const adminCreateGenfors = (password, title, date) => ({
  type: ADMIN_CREATE_GENFORS,
  password,
  title,
  date,
});
