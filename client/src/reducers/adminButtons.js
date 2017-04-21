import { TOGGLE_REGISTRATION } from '../../../common/actionTypes/adminButtons';

const registrationEnabled = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_REGISTRATION:
      return !state;

    default:
      return state;
  }
};

export default registrationEnabled;
