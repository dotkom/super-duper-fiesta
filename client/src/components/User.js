import React, { PropTypes } from 'react';
import classNames from 'classnames';

const User = ({ name, canVote }) => {
  const userClass = classNames({
    'Users-list--can-not-vote': !canVote,
  });
  return (
    <tr className={userClass}>
      <td className="Users-list--left">{name}</td>
      <td className="Users-list--right">1. september 1939</td>
    </tr>
  );
};

User.defaultProps = {
  canVote: false,
};

User.propTypes = {
  name: PropTypes.string.isRequired,
  canVote: PropTypes.bool,
};

export default User;
