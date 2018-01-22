import { VERSION } from 'common/actionTypes/version';

const appVersion = (state = '', action) => {
  switch (action.type) {
    case VERSION:
      return action.data.version;

    default:
      return state;
  }
};

export default appVersion;
