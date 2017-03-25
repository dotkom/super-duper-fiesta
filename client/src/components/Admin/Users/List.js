import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import { toggleCanVote } from '../../../actionCreators/users';
import User from './User';
import '../../../css/Users.css';

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

const mapStateToProps = (state) => {
  // Use Fuse for fuzzy-search.
  const fuse = new Fuse(state.users, {
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name'],
  });

  return {
    // Show all users if there is no filter in the box.
    users: state.userFilter ? fuse.search(state.userFilter) : state.users,
  };
};

const mapDispatchToProps = dispatch => ({
  toggleCanVote: (id) => {
    dispatch(toggleCanVote(id));
  },
});

export default UserList;
export const UserListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserList);
