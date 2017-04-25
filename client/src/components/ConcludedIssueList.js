import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConcludedIssue from './ConcludedIssue';
import css from './ConcludedIssueList.css';
import { getConcludedIssues } from '../selectors/issues';
import { RESOLUTION_TYPES } from '../../../common/actionTypes/voting';
import Button from './Button';

// Maps over alternatives to see if any of them got majority vote
const calculateMajority = (issue) => {
  const { alternatives, votes } = issue;
  const voteDemand = RESOLUTION_TYPES[issue.voteDemand].voteDemand;
  const numTotalVotes = Object.keys(votes).length;
  const voteObjects = Object.keys(votes).map(key => votes[key]);

  // Count votes for each alternative
  const alternativeVoteCounts = alternatives.map(alternative => (
    voteObjects.filter(vote => vote.alternative === alternative.id).length
  ));

  let countingTotalVotes = numTotalVotes;
  const { countBlankVotes } = issue;
  const blankAlternative = alternatives.find(alternative => alternative.text === 'Blank');
  const blankIdx = alternatives.indexOf(blankAlternative);
  // Subtract blank votes if they don't count
  if (!countBlankVotes) {
    countingTotalVotes -= alternativeVoteCounts[blankIdx];
  }

  // Check if any alternative meets the vote demand
  return alternativeVoteCounts.some((alternativeVoteCount, idx) => {
    // Skip blank vote
    if (idx === blankIdx) {
      return false;
    }
    return alternativeVoteCount / countingTotalVotes > voteDemand;
  });
};

class ConcludedIssueList extends React.Component {
  constructor() {
    super();

    this.state = {
      visible: false,
    };
  }

  toggleVisibility() {
    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  }

  render() {
    const issues = this.props.issues;
    const { visible } = this.state;

    return (
      <div>
        {Object.keys(issues).length > 0 && <Button
          background
          size="lg"
          onClick={() => this.toggleVisibility()}
        >
          {visible ? 'Skjul' : 'Vis'} konkluderte saker
        </Button>}
        <div className={css.concludedIssueList}>
          {this.state.visible && Object.keys(issues).map(issue => (
            <ConcludedIssue
              key={issues[issue].id}
              majority={calculateMajority(issues[issue])}
              {...issues[issue]}
            />
          ))}
        </div>
      </div>
    );
  }
}

ConcludedIssueList.propTypes = {
  issues: PropTypes.shape({
    votes: React.PropTypes.objectOf(React.PropTypes.string),
  }).isRequired,
};

export default ConcludedIssueList;

const mapStateToProps = state => ({
  issues: state.votingEnabled ?
    getConcludedIssues(state) : state.issues,
});

export const ConcludedIssueListContainer = connect(
  mapStateToProps,
)(ConcludedIssueList);
