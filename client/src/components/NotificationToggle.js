import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from './Button';
import { toggleNotification } from '../actionCreators/notification';
import { notificationIsEnabled } from '../selectors/notification';

const NotificationToggle = ({ enabled, toggle }) => (
  <Button
    background
    size="lg"
    onClick={toggle}
  >
    Skru { enabled ? 'av' : 'på' } notifikasjoner
  </Button>
);

NotificationToggle.propTypes = {
  enabled: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  enabled: notificationIsEnabled(state),
});

const mapDispatchToProps = {
  toggle: toggleNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationToggle);
