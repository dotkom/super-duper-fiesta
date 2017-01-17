const meeting = (state = {}, action) => {
  switch (action.type) {
    case 'server/meeting': {
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
