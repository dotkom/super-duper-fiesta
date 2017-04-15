import React from 'react';
import { connect } from 'react-redux';
import { getIssueText } from '../../selectors/issues';
import Card from '../Card';
import css from './Issue.css';

const Issue = ({ text }) => (
  <Card
    classes={css.issue}
    subtitle="Aktiv sak"
  >
    <p>{text}</p>
  </Card>
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
