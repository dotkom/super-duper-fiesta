import { ADMIN_END_MEETING, TOGGLE_REGISTRATION_STATE } from 'common/actionTypes/meeting';

export const endGAM = () => ({
  type: ADMIN_END_MEETING,
});

export const toggleRegistration = registrationOpen => ({
  type: TOGGLE_REGISTRATION_STATE,
  registrationOpen,
});
