import React, { PropTypes } from 'react';
import User from './User';
import '../css/Users.css';

const UserList = ({ users, toggleCanVote }) => (
  <table className="Users-list">
    <thead>
      <tr>
        <th className="Users-list--left">Bruker</th>
        <th className="Users-list--right">Registrert</th>
        <th className="Users-list--right">Toggle voting</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user =>
        <User
          name={user.name}
          canVote={user.canVote}
          key={user.id}
          toggleCanVote={toggleCanVote}
          id={user.id}
        />,
      )}
    </tbody>
  </table>
);

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    canVote: PropTypes.bool.isRequired,
  })).isRequired,

  toggleCanVote: PropTypes.func.isRequired,
};

export default UserList;
