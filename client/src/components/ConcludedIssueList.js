import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConcludedIssue from './ConcludedIssue';
import css from './ConcludedIssueList.css';
import { getConcludedIssues } from '../selectors/issues';
import Button from './Button';

// Maps over alternatives to see if any of them got majority vote
const calculateMajority = (alternatives, votes, voteDemand) => {
  const numTotalVotes = Object.keys(votes).length;
  return alternatives.some(alternative => Object.keys(votes)
    .map(key => votes[key])
    .filter(vote => vote.alternative === alternative.id)
    .length / numTotalVotes >= voteDemand,
  );
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
              majority={calculateMajority(
                issues[issue].alternatives,
                issues[issue].votes,
                issues[issue].voteDemand,
              )}
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
