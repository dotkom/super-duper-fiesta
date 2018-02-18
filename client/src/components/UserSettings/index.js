import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  toggleNotification,
  toggleShowConcludedIssueList,
} from 'features/userSettings/actionCreators';
import { getConcludedIssuesExceptLatest } from 'features/issue/selectors';
import {
  notificationIsEnabled,
  concludedIssueListIsEnabled,
} from 'features/userSettings/selectors';
import Button from '../Button';
import Permissions from './Permissions';
import css from './UserSettings.css';

const UserSettings = ({
  canVote,
  concludedIssues,
  notificationsEnabled,
  notificationToggle,
  concludedIssueListEnabled,
  concludedIssueListToggle,
  permissions,
}) => (
  <div className={css.component}>
    <Button
      background
      size="lg"
      onClick={notificationToggle}
    >
      Skru { notificationsEnabled ? 'av' : 'på' } notifikasjoner
    </Button>
    {Object.keys(concludedIssues).length > 0 && <Button
      background
      size="lg"
      onClick={concludedIssueListToggle}
    >
      {concludedIssueListEnabled ? 'Skjul' : 'Vis'} konkluderte saker
    </Button>}
    <Permissions canVote={canVote} permissions={permissions} />
  </div>
);

UserSettings.defaultProps = {
  canVote: false,
  concludedIssues: {},
  permissions: 0,
};

UserSettings.propTypes = {
  canVote: PropTypes.bool,
  concludedIssues: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  concludedIssueListEnabled: PropTypes.bool.isRequired,
  concludedIssueListToggle: PropTypes.func.isRequired,
  notificationsEnabled: PropTypes.bool.isRequired,
  notificationToggle: PropTypes.func.isRequired,
  permissions: PropTypes.number,
};

const mapStateToProps = state => ({
  canVote: state.auth.canVote,
  permissions: state.auth.permissions,
  concludedIssues: getConcludedIssuesExceptLatest(state),
  notificationsEnabled: notificationIsEnabled(state),
  concludedIssueListEnabled: concludedIssueListIsEnabled(state),
});

const mapDispatchToProps = {
  notificationToggle: toggleNotification,
  concludedIssueListToggle: toggleShowConcludedIssueList,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
