import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import { CAN_VOTE } from 'common/auth/permissions';
import { adminToggleCanVote } from 'features/user/actionCreators';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import classNames from 'classnames';
import css from './List.css';
import { RegisteredIndicator, PermissionDisplay, ToggleCanVoteIndicator } from './Table';

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

  const data = [...Object.keys(users)
    .sort((a, b) => users[a].name.localeCompare(users[b].name))
    .map(key => users[key])
    .map(user => ({
      name: user.name,
      canVote: user.canVote,
      registered: {
        registeredDate: user.registered,
        isRegistered: user.completedRegistration,
      },
      id: user.id,
      permissions: user.permissions,
      setPermissions: user.setPermissions,
    }))];

  console.log(data);

  const columns = [{
    Header: `Navn (${totalUsers})`,
    accessor: 'name',
  }, {
    Header: `Registrert (${usersRegistered})`,
    accessor: 'registered',
    className: css.center,
    Cell: RegisteredIndicator,
  }, {
    Header: `Rettigheter (${usersHasPermsToVote})`,
    accessor: 'permissions',
    Cell: PermissionDisplay,
  }, {
    Header: `Stemmeberettigelse (${usersCanVote}/${usersHasPermsToVote})`,
    accessor: 'canVote',
    className: css.center,
    Cell: props => ToggleCanVoteIndicator(props, toggleCanVote),
  }];

  return (
    <ReactTable
      data={data}
      columns={columns}
      className={css.table}
      previousText="Forrige"
      nextText="Neste"
      loadingText="Laster inn..."
      noDataText="Ingen rekker funnet"
      pageText="Side"
      ofText="av"
      rowsText="rekker"
      getTrProps={(state, rowInfo) => ({
        className: classNames({
          [css.canNotVote]: !(rowInfo && rowInfo.row.canVote),
        }),
      })}
      getTdProps={() => ({
        className: css.tableCell,
      })}
    />);
};

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
