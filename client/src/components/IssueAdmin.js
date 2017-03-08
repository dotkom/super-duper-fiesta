import React from 'react';
import Button from './Button';
import ActiveIssue from '../containers/ActiveIssue';
import IconText from './IconText';

const IssueAdmin = ({ closeIssue, issue }) => (
  <div>
    <ActiveIssue />
    <Button>
      <IconText text="Rediger" iconClass="flaticon-edit" />
    </Button>
    <Button>
      <IconText text="Resett" iconClass="flaticon-refresh" />
    </Button>
    <Button onClick={closeIssue} hidden={!issue}>
      <IconText text="Avslutt" iconClass="flaticon-lock" />
    </Button>
    <Button>
      <IconText text="Slett" iconClass="flaticon-cross" />
    </Button>
  </div>
);

IssueAdmin.propTypes = {
  closeIssue: React.PropTypes.func.isRequired,
};

export default IssueAdmin;
