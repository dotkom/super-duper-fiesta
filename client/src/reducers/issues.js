import { CLOSE_ISSUE, OPEN_ISSUE, SEND_VOTE, DELETED_ISSUE } from '../../../common/actionTypes/issues';
import { RECEIVE_VOTE } from '../../../common/actionTypes/voting';

const issue = (state = { votes: {} }, action, currentIssue) => {
  switch (action.type) {
    case CLOSE_ISSUE:
    case OPEN_ISSUE: {
      return {
        ...state,
        id: action.data._id, // eslint-disable-line no-underscore-dangle
        active: action.data.active,
        date: action.data.date,
        text: action.data.description,
        alternatives: action.data.options.map((originalAlternative) => {
          const alternative = Object.assign({}, originalAlternative);
          // Proxy `_id` as `id`.
          alternative.id = alternative._id; // eslint-disable-line no-underscore-dangle
          return alternative;
        }),
        qualifiedVoters: action.data.qualifiedVoters,
        resolutionType: action.resolutionType,
        secret: action.data.secret,
        voteDemand: action.data.voteDemand,
        countingBlankVotes: action.data.countingBlankVotes,
        showOnlyWinner: action.data.showOnlyWinner,
        votes: action.data.votes || {},
        winner: action.data.winner,
      };
    }

    case RECEIVE_VOTE:
    case SEND_VOTE: {
      // If the vote has been cancelled before this vote was submitted, it needs
      // to be discarded. We also skip it if this is not the current issue.
      if (action.type === SEND_VOTE && (state.id !== currentIssue || state.id !== action.issueId)) {
        return state;
      }
      const voteId = action.id;
      const voter = action.voter;

      return Object.assign({}, state, {
        votes: {
          ...state.votes,

          [voteId]: {
            alternative: action.alternative,
            id: voteId,
            voter,
          },
        },
      });
    }

    default:
      return state;
  }
};

const issues = (state = {}, action) => {
  switch (action.type) {
    case CLOSE_ISSUE:
    case OPEN_ISSUE: {
      const issueId = action.data._id; // eslint-disable-line no-underscore-dangle
      return Object.assign({}, state, {
        [issueId]: issue(state[issueId], action),
      });
    }
    case DELETED_ISSUE: {
      const deletedIssueId = action.data._id; // eslint-disable-line no-underscore-dangle
      return Object.keys(state).reduce((result, issueId) => {
        if (issueId !== deletedIssueId) {
          return {
            ...result,
            [issueId]: state[issueId],
          };
        }
        return result;
      }, {});
    }
    case RECEIVE_VOTE:
    case SEND_VOTE: {
      const issueId = action.data.question;
      const updatedAction = {
        type: action.type,
        issueId,
        alternative: action.data.option,
        voter: action.data.user,
        id: action.data._id, // eslint-disable-line no-underscore-dangle
      };
      return Object.assign({}, state, {
        [issueId]: issue(state[issueId], updatedAction, issueId),
      });
    }

    default:
      return state;
  }
};

export default issues;
