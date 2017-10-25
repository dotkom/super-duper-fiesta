const RESOLUTION_TYPES = {
  regular: {
    key: 'regular',
    name: 'Alminnelig flertall',
    voteDemand: 1 / 2,
    voteDemandText: '1/2',
  },
  qualified: {
    key: 'qualified',
    name: 'Kvalifisert flertall',
    voteDemand: 2 / 3,
    voteDemandText: '2/3',
  },
};

const getResolutionTypeDisplay = (voteDemand) => {
  switch (voteDemand) {
    case RESOLUTION_TYPES.regular.key:
      return RESOLUTION_TYPES.regular;

    case RESOLUTION_TYPES.qualified.key:
      return RESOLUTION_TYPES.qualified;

    default:
      return {
        key: 'invalid',
        name: 'Ugylding avgjørelsestype!',
        voteDemand: 0,
        voteDemandText: '0',
      };
  }
};

module.exports = {
  DISABLE_VOTING: 'DISABLE_VOTING',
  ENABLE_VOTING: 'ENABLE_VOTING',
  RECEIVE_VOTE: 'ADD_VOTE',
  SUBMIT_ANONYMOUS_VOTE: 'server/SUBMIT_ANONYMOUS_VOTE',
  SUBMIT_REGULAR_VOTE: 'server/SUBMIT_REGULAR_VOTE',
  USER_VOTE: 'USER_VOTE',
  RESOLUTION_TYPES,
  getResolutionTypeDisplay,
};
