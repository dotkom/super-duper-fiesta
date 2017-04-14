import { AUTH_SIGNED_OUT, AUTH_REGISTER } from '../actionTypes/auth';

export const register = (pin, passwordHash) => ({
  type: AUTH_REGISTER,
  pin,
  passwordHash,
});

export const signOut = () => ({
  type: AUTH_SIGNED_OUT,
});
