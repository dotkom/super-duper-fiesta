import React from 'react';
import PropTypes from 'prop-types';
import { getPermissionDisplay } from 'common/auth/permissions';
import classNames from 'classnames';
import moment from 'moment';
import css from './List.css';
import { ToggleCanVoteContainer } from '../ToggleCanVote';

export const RegisteredIndicator = props =>
  <div
    className={classNames(css.action,
      {
        [css.success]: props.value.isRegistered,
        [css.close]: !props.value.isRegistered,
        [css.toggle]: props.value.isRegistered,
      },
        )}
    title={`${moment(props.value.registeredDate).format('LLL')} (${moment(props.value.registeredDate).fromNow()})`}
  >{props.value.isRegistered}</div>;

RegisteredIndicator.propTypes = {
  value: PropTypes.shape({
    registeredDate: PropTypes.string,
    isRegistered: PropTypes.bool,
  }).isRequired,
};

export const PermissionDisplay = props =>
  getPermissionDisplay(props.value);

PermissionDisplay.propTypes = {
  value: PropTypes.number,
};

export const ToggleCanVoteIndicator = (props, toggleCanVote) =>
  <ToggleCanVoteContainer
    canVote={props.value}
    id={props.original.id}
    permissions={props.original.permissions}
    setPermissions={props.original.setPermissions}
    toggleCanVote={toggleCanVote}
  />;

ToggleCanVoteIndicator.propTypes = {
  value: PropTypes.bool.isRequired,
  original: PropTypes.shape({
    id: PropTypes.string,
    permissions: PropTypes.number,
    setPermissions: PropTypes.func.isRequired,
  }).isRequired,
};
