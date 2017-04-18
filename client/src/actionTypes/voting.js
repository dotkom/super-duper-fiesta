export const DISABLE_VOTING = 'DISABLE_VOTING';
export const ENABLE_VOTING = 'ENABLE_VOTING';
export const RECEIVE_VOTE = 'ADD_VOTE';
export const SUBMIT_ANONYMOUS_VOTE = 'server/SUBMIT_ANONYMOUS_VOTE';
export const SUBMIT_REGULAR_VOTE = 'server/SUBMIT_REGULAR_VOTE';
export const VOTING_STATE = 'VOTED_STATE';

export const RESOLUTION_TYPES = {
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

  // @ToDo: Remove these before production. Kept for backwards compatibility. 'oldResolutionTypes'
  [1 / 2]: {
    key: 'regular',
    name: 'Alminnelig flertall',
    voteDemand: 1 / 2,
    voteDemandText: '1/2',
  },
  [2 / 3]: {
    key: 'qualified',
    name: 'Kvalifisert flertall',
    voteDemand: 2 / 3,
    voteDemandText: '2/3',
  },
};

export const getResolutionTypeDisplay = (voteDemand) => {
  switch (voteDemand) {
    case RESOLUTION_TYPES.regular.key:
      return RESOLUTION_TYPES.regular;
    case 1 / 2: {
      console.warn('WARNING! You have outdated resolution types in your database.'); // 'oldResolutionTypes'
      return RESOLUTION_TYPES.regular;
    }

    case RESOLUTION_TYPES.qualified.key:
      return RESOLUTION_TYPES.qualified;
    case 2 / 3: {
      console.warn('WARNING! You have outdated resolution types in your database.'); // 'oldResolutionTypes'
      return RESOLUTION_TYPES.qualified;
    }
    default:
      return {
        key: 'invalid',
        name: 'Ugylding avgjørelsestype!',
        voteDemand: 0,
        voteDemandText: '0',
      };
  }
}
