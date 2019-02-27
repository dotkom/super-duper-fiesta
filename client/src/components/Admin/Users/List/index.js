import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import { CAN_VOTE, getPermissionDisplay } from 'common/auth/permissions';
import { adminToggleCanVote } from 'features/user/actionCreators';
import { UserContainer } from '../User';
import ReactTable from 'react-table'
import css from './List.css';
import 'react-table/react-table.css'
import classNames from 'classnames';

const UserList = ({ users, toggleCanVote }) => {
  const userKeys = Object.keys(users);
  const totalUsers = userKeys.length;
  const usersCanVote = userKeys
    .filter(u => users[u].canVote)
    .length;
  const usersHasPermsToVote = userKeys
    .filter(u => users[u].permissions >= CAN_VOTE)
    .length;
  const usersRegistered = userKeys
    .filter(u => users[u].completedRegistration)
    .length;
  const data = Object.keys(users)
    .sort((a, b) => users[a].name.localeCompare(users[b].name))
    .map((key) => users[key]);
  console.log(data);
  const columns = [{
    Header: `Name (${totalUsers})` ,
    accessor: 'name', // String-based value accessors!
  }, {
    Header: `Registrert (${usersRegistered})`,
    accessor: `completedRegistration`,
    Cell: props => <div
            className={classNames(css.action,
              { [css.success]: props.value,
                [css.close]: !props.value,
                [css.toggle]: props.value,
              },
          )}
          >{props.value}</div>
  }, {
    Header: `Rettigheter`,
    accessor: `permissions`,
    Cell:  props => getPermissionDisplay(props.value)
  }
  ]

  return (
  <ReactTable
    data={data}
    columns={columns}
  />)
}
/*
   <table className={css.list}>
      <thead>
        <tr>
          <th className={css.left}>Bruker ({totalUsers})</th>
          <th className={css.right} title="Har fullført oppmøteregistrering">
            Registrert ({usersRegistered})
          </th>
          <th className={css.right} title="(Antall med stemmerett)">
            Rettigheter ({usersHasPermsToVote})
          </th>
          <th className={css.right}>
            Stemmeberettigelse ({usersCanVote}/{usersHasPermsToVote})
          </th>
        </tr>
      </thead>
      <tbody>
        
      </tbody>
    </table>*/
  


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
      threshold: 0.2,
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
