import React from 'react';
import Button from './Button';
import ActiveIssue from '../containers/ActiveIssue';
import '../css/Issue.css';

const IssueAdmin = ({ issue, closeIssue }) => (
  <div>
    <ActiveIssue />
    <Button onClick={() => closeIssue(issue)}>Avslutt sak</Button>
  </div>
);

IssueAdmin.defaultProps = {
  issue: {
    _id: '-1',
    text: 'Ingen aktiv sak.',
  },
};

IssueAdmin.propTypes = {
  issue: React.PropTypes.shape({
    _id: React.PropTypes.string,
    name: React.PropTypes.string,
  }),
  closeIssue: React.PropTypes.func.isRequired,
};

export default IssueAdmin;
