import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConcludedIssue from './ConcludedIssue';
import css from './ConcludedIssueList.css';
import { getConcludedIssues } from '../selectors/issues';
import Button from './Button';

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
          {this.state.visible && Object.keys(issues).map((issue) => {
            const winner = issues[issue].winner;
            const majority = winner !== null;
            return (<ConcludedIssue
              key={issues[issue].id}
              majority={majority}
              {...issues[issue]}
            />);
          })}
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
