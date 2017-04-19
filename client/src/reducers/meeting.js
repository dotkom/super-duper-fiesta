import { OPEN_MEETING } from '../../../common/actionTypes/meeting';

const meeting = (state = {}, action) => {
  switch (action.type) {
    case OPEN_MEETING: {
      return {
        title: action.data.title,
      };
    }
    default: {
      return state;
    }
  }
};

export default meeting;
