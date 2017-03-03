import React from 'react';
import Button from './Button';
import ActiveIssue from '../containers/ActiveIssue';

const IssueAdmin = ({ onEndClick }) => (
  <div>
    <ActiveIssue />
    <Button onClick={onEndClick}>Avslutt sak</Button>
  </div>
);

IssueAdmin.propTypes = {
  onEndClick: React.PropTypes.func.isRequired,
};

export default IssueAdmin;
