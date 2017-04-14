import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import css from './css/User.css';

const User = ({ id, name, registered, canVote, toggleCanVote }) => {
  const userClass = classNames({
    [css.canNotVote]: !canVote,
  });
  const registeredDate = moment(registered);
  return (
    <tr className={userClass}>
      <td className={css.left}>{name}</td>
      <td className={css.right}>
        {registeredDate.format('LLL')} ({registeredDate.fromNow()})
      </td>
      <td className={css.right}>
        <input
          type="checkbox"
          onChange={() => toggleCanVote(id, canVote)}
          checked={canVote}
        />
      </td>
    </tr>
  );
};

User.propTypes = {
  name: PropTypes.string.isRequired,
  canVote: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  registered: PropTypes.string.isRequired,
  toggleCanVote: PropTypes.func.isRequired,
};

export default User;
