import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import { adminToggleCanVote } from '../../../actionCreators/users';
import User from './User';
import css from './List.css';

const UserList = ({ users, toggleCanVote }) => (
  <table className={css.list}>
    <thead>
      <tr>
        <th className={css.left}>Bruker</th>
        <th className={css.right} title="Har fullført oppmøteregistrering">Registrert</th>
        <th className={css.right}>Rettigheter</th>
        <th className={css.right}>Stemmeberettigelse</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(users)
        .sort((a, b) => users[a].name > users[b].name)
        .map((key) => {
          const user = users[key];
          return (<User
            name={user.name}
            canVote={user.canVote}
            completedRegistration={user.completedRegistration}
            key={user.id}
            permissions={user.permissions}
            registered={user.registered}
            toggleCanVote={toggleCanVote}
            id={user.id}
          />);
        },
      )}
    </tbody>
  </table>
);

UserList.propTypes = {
  users: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    canVote: PropTypes.bool.isRequired,
  })).isRequired,
  toggleCanVote: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  // Show all users if there is no filter in the box.
  let presentedUsers = state.users;

  // Filter users by using Fuse fuzzy search
  if (state.userFilter && state.userFilter.length > 0) {
    presentedUsers = new Fuse(Object.keys(state.users).map(key => state.users[key]), {
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name'],
    }).search(state.userFilter)
      .reduce((a, b) => ({ ...a, [b.id]: b }), {});
  }

  return {
    users: presentedUsers,
  };
};

const mapDispatchToProps = dispatch => ({
  toggleCanVote: (id, canVote) => {
    dispatch(adminToggleCanVote(id, canVote));
  },
});

export default UserList;
export const UserListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserList);
