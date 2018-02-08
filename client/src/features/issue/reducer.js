import { CLOSE_ISSUE, OPEN_ISSUE, SEND_VOTE, DELETED_ISSUE } from 'common/actionTypes/issues';
import { RECEIVE_VOTE, USER_VOTE, DISABLE_VOTING, ENABLE_VOTING } from 'common/actionTypes/voting';

const issue = (state = { votes: {} }, action, currentIssue) => {
  switch (action.type) {
    case CLOSE_ISSUE:
    case OPEN_ISSUE: {
      return {
        ...state,
        id: action.data.id,
        active: action.data.active,
        date: action.data.date,
        text: action.data.description,
        alternatives: action.data.alternatives.map((originalAlternative) => {
          const alternative = Object.assign({}, originalAlternative);
          return alternative;
        }),
        qualifiedVoters: action.data.qualifiedVoters,
        resolutionType: action.resolutionType,
        secret: action.data.secret,
        voteDemand: action.data.voteDemand,
        countingBlankVotes: action.data.countingBlankVotes,
        showOnlyWinner: action.data.showOnlyWinner,
        status: action.data.status,
        votes: action.data.votes || {},
        winner: action.data.winner,
        userVote: state.userVote || null,
      };
    }
    case USER_VOTE: {
      return {
        ...state,
        userVoteAlternative: action.data.alternativeId,
      };
    }

    case RECEIVE_VOTE: {
      // If the vote has been cancelled before this vote was submitted, it needs
      // to be discarded. We also skip it if this is not the current issue.
      if (state.id !== currentIssue || state.id !== action.issueId) {
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
            randomName: action.randomName,
          },
        },
      });
    }

    case DISABLE_VOTING:
    case ENABLE_VOTING:
      return {
        ...state,
        status: action.data.status,
      };

    default:
      return state;
  }
};

const issues = (state = {}, action) => {
  switch (action.type) {
    case CLOSE_ISSUE:
    case DISABLE_VOTING:
    case ENABLE_VOTING:
    case OPEN_ISSUE: {
      const issueId = action.data.id;
      return Object.assign({}, state, {
        [issueId]: issue(state[issueId], action),
      });
    }
    case DELETED_ISSUE: {
      const deletedIssueId = action.data.id;
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
    case USER_VOTE: {
      const { issueId } = action.data;
      return {
        ...state,
        [issueId]: issue(state[issueId], action, issueId),
      };
    }
    case RECEIVE_VOTE:
    case SEND_VOTE: {
      const issueId = action.data.question;
      const updatedAction = {
        type: action.type,
        issueId,
        alternative: action.data.alternative,
        voter: action.data.user,
        id: action.data.id,
        randomName: action.data.randomName,
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
