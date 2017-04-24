import {
  OPEN_MEETING,
  TOGGLED_REGISTRATION_STATE } from '../../../common/actionTypes/meeting';

const meeting = (state = {}, action) => {
  switch (action.type) {
    case OPEN_MEETING: {
      return {
        ...state,
        pin: action.data.pin,
        registrationOpen: action.data.registrationOpen,
        status: action.data.status,
        title: action.data.title,
      };
    }
    case TOGGLED_REGISTRATION_STATE:
      return {
        ...state,
        registrationOpen: action.data.registrationOpen,
      };
    default: {
      return state;
    }
  }
};

export default meeting;
