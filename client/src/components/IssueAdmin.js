import React from 'react';
import Button from './Button';
import ActiveIssue from '../containers/ActiveIssue';

const IssueAdmin = ({ closeIssue }) => (
  <div>
    <ActiveIssue />
    <Button background onClick={closeIssue}>Avslutt sak</Button>
  </div>
);

IssueAdmin.propTypes = {
  closeIssue: React.PropTypes.func.isRequired,
};

export default IssueAdmin;
