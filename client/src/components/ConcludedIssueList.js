import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';
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
      filter: '',
      visible: false,
    };
  }

  toggleVisibility() {
    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  }

  render() {
    const { visible } = this.state;
    // Issues is obj, need to make list and parse back to obj afterwards.
    const issues = this.state.filter.length ? new Fuse(this.props.issues, {
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['text'],
    }).search(this.state.filter) : this.props.issues;

    return (
      <div>
        <Button
          background
          size="lg"
          onClick={() => this.toggleVisibility()}
        >
          {visible ? 'Skjul' : 'Vis'} konkluderte saker
        </Button>
        {visible && <span
          className={css.filter}
          value={this.state.filter}
          onChange={e => this.setState({ filter: e.target.value })}
        >
          <input placeholder="Filtrer saker" />
        </span>}
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
