import React, { PropTypes } from 'react';
import classNames from 'classnames';

const User = ({ id, name, canVote, toggleCanVote }) => {
  const userClass = classNames({
    'Users-list--can-not-vote': !canVote,
  });
  return (
    <tr className={userClass}>
      <td className="Users-list--left">{name}</td>
      <td className="Users-list--right">1. september 1939</td>
      <td><button onClick={() => toggleCanVote(id)}>toggle voting</button></td>
    </tr>
  );
};

User.propTypes = {
  name: PropTypes.string.isRequired,
  canVote: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  toggleCanVote: PropTypes.func.isRequired,
};

export default User;
