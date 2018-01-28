import { ERROR_DISMISS } from 'common/actionTypes/error';

// eslint-disable-next-line import/prefer-default-export
export const dismissError = id => ({
  type: ERROR_DISMISS,
  data: {
    id,
  },
});
