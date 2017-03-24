import React from 'react';
import { connect } from 'react-redux';
import { getIssueText } from '../selectors/issues';
import '../css/Issue.css';

const Issue = ({ text }) => (
  <div className="Issue">
    <h2 className="Issue-heading">Aktiv sak</h2>
    <p>{text}</p>
  </div>
);

Issue.defaultProps = {
  text: 'Ingen aktiv sak for øyeblikket.',
};

Issue.propTypes = {
  text: React.PropTypes.string,
};


const mapStateToProps = state => ({
  text: getIssueText(state),
});

export default Issue;
export const IssueContainer = connect(
  mapStateToProps,
)(Issue);
