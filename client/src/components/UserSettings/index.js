import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../Button';
import {
  toggleNotification,
  toggleShowConcludedIssueList,
} from '../../actionCreators/userSettings';
import { getConcludedIssuesExceptLatest } from '../../selectors/issues';
import {
  notificationIsEnabled,
  concludedIssueListIsEnabled,
} from '../../selectors/userSettings';
import css from './UserSettings.css';

const UserSettings = ({
  concludedIssues,
  notificationsEnabled,
  notificationToggle,
  concludedIssueListEnabled,
  concludedIssueListToggle,
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
  </div>
);

UserSettings.defaultProps = {
  concludedIssues: {},
};

UserSettings.propTypes = {
  concludedIssues: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  concludedIssueListEnabled: PropTypes.bool.isRequired,
  concludedIssueListToggle: PropTypes.func.isRequired,
  notificationsEnabled: PropTypes.bool.isRequired,
  notificationToggle: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  concludedIssues: getConcludedIssuesExceptLatest(state),
  notificationsEnabled: notificationIsEnabled(state),
  concludedIssueListEnabled: concludedIssueListIsEnabled(state),
});

const mapDispatchToProps = {
  notificationToggle: toggleNotification,
  concludedIssueListToggle: toggleShowConcludedIssueList,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
