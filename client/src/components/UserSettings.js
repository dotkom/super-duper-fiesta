import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from './Button';
import { toggleNotification } from '../actionCreators/userSettings';
import { notificationIsEnabled } from '../selectors/userSettings';
import css from './UserSettings.css';

const UserSettings = ({ notificationsEnabled, notificationToggle }) => (
  <div className={css.component}>
    <div className={css.toggleButtons}>
      <Button
        background
        size="lg"
        onClick={notificationToggle}
      >
        Skru { notificationsEnabled ? 'av' : 'på' } notifikasjoner
      </Button>
    </div>
  </div>
);

UserSettings.propTypes = {
  notificationsEnabled: PropTypes.bool.isRequired,
  notificationToggle: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  notificationsEnabled: notificationIsEnabled(state),
});

const mapDispatchToProps = {
  notificationToggle: toggleNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
