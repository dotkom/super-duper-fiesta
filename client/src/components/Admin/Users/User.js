import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import css from './User.css';

const User = ({ id, name, registered, canVote, toggleCanVote }) => {
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
  return (
    <tr className={userClass}>
      <td className={css.left}>{name}</td>
      <td className={css.right}>
        {registeredDate.format('LLL')} ({registeredDate.fromNow()})
      </td>
      <td className={css.right}>
        <button className={css.action} onClick={() => toggleCanVote(id, true)}>
          <div className={successToggle} />
        </button>
        <button className={css.action} onClick={() => toggleCanVote(id, false)}>
          <div className={closeToggle} />
        </button>
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
