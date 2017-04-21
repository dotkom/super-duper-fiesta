import { ADMIN_CREATE_ISSUE, ADMIN_CLOSE_ISSUE, TOGGLE_REGISTRATION } from '../../../common/actionTypes/adminButtons';

export const toggleRegistration = () => ({
  type: TOGGLE_REGISTRATION,
});

export const adminCloseIssue = data => ({
  type: ADMIN_CLOSE_ISSUE,
  data,
});

export const createIssue = (description, alternatives, voteDemand,
  showOnlyWinner, secretVoting, countBlankVotes) => ({
    type: ADMIN_CREATE_ISSUE,
    data: {
      description,
      options: alternatives,
      voteDemand,
      showOnlyWinner,
      secret: secretVoting,
      countingBlankVotes: countBlankVotes,
    },
  }
);
