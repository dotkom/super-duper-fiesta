import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import css from './User.css';
import { CAN_VOTE, getPermissionDisplay } from '../../../../../common/auth/permissions';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, name, registered, canVote, completedRegistration, permissions, toggleCanVote,
    } = this.props;
    const userClass = classNames({
      [css.canNotVote]: !canVote,
    });
    const registeredDate = moment(registered);
    const successToggle = classNames(
      css.success,
      { [css.toggle]: canVote },
    );
    const closeToggle = classNames(
      css.close,
      { [css.toggle]: !canVote },
    );
    const permissionLevel = getPermissionDisplay(permissions);
    return (
      <tr className={userClass}>
        <td className={css.left}>{name}</td>
        <td
          className={css.right}
          title={`${registeredDate.format('LLL')} (${registeredDate.fromNow()})`}
        >
          <div
            className={classNames(css.action,
              { [css.success]: completedRegistration,
                [css.close]: !completedRegistration,
                [css.toggle]: completedRegistration,
              },
          )}
          >{completedRegistration}</div>
        </td>
        <td className={css.right}>
          {permissionLevel}
        </td>
        <td className={css.right}>
          <button
            className={css.action}
            disabled={permissions < CAN_VOTE}
            onClick={() => toggleCanVote(id, true)}
          >
            <div
              className={permissions >= CAN_VOTE ? successToggle : css.unavailable}
              title={permissions >= CAN_VOTE
                ? 'Gi brukeren stemmerett'
                : 'Brukeren har ikke rett til å få stemmerett.'}
            />
          </button>
          <button className={css.action} onClick={() => toggleCanVote(id, false)}>
            <div className={closeToggle} title="Fjern brukerens stemmerett" />
          </button>
        </td>
      </tr>
    );
  }
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  canVote: PropTypes.bool.isRequired,
  completedRegistration: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  permissions: PropTypes.number.isRequired,
  registered: PropTypes.string.isRequired,
  toggleCanVote: PropTypes.func.isRequired,
};

export default User;
