import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import { requestUserList, adminToggleCanVote } from '../../../actionCreators/users';
import User from './User';
import css from './List.css';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.props.requestUserList();
  }
  render() {
    const { users, toggleCanVote } = this.props;
    return (
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
  }
}

UserList.propTypes = {
  users: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    canVote: PropTypes.bool.isRequired,
  })).isRequired,
  requestUserList: PropTypes.func.isRequired,
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
  toggleCanVote: (id, canVote) => {
    dispatch(adminToggleCanVote(id, canVote));
  },
  requestUserList: () => {
    dispatch(requestUserList());
  },
});

export default UserList;
export const UserListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserList);
