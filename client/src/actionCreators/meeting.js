import { TOGGLE_REGISTRATION_STATE } from '../../../common/actionTypes/meeting';

// eslint-disable-next-line import/prefer-default-export
export const toggleRegistration = registrationOpen => ({
  type: TOGGLE_REGISTRATION_STATE,
  registrationOpen,
});
