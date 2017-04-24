import { ADMIN_CREATE_ISSUE, ADMIN_CLOSE_ISSUE, ADMIN_DELETE_ISSUE } from '../../../common/actionTypes/adminButtons';

export const adminCloseIssue = data => ({
  type: ADMIN_CLOSE_ISSUE,
  data,
});

export const adminDeleteIssue = data => ({
  type: ADMIN_DELETE_ISSUE,
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
