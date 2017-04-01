import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

const User = ({ id, name, registered, canVote, toggleCanVote }) => {
  const userClass = classNames({
    'Users-list--can-not-vote': !canVote,
  });
  const registeredDate = moment(registered);
  return (
    <tr className={userClass}>
      <td className="Users-list--left">{name}</td>
      <td className="Users-list--right">
        {registeredDate.toLocaleString()} ({registeredDate.fromNow()})
      </td>
      <td className="Users-list--right">
        <button onClick={() => toggleCanVote(id, canVote)}>
          {canVote ? 'Fjern stemmerett' : 'Gi stemmerett'}
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
