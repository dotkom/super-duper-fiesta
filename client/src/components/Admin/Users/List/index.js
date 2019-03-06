import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import { CAN_VOTE, getPermissionDisplay } from 'common/auth/permissions';
import { adminToggleCanVote } from 'features/user/actionCreators';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import classNames from 'classnames';
import { ToggleCanVoteContainer } from '../ToggleCanVote';
import moment from 'moment';
import css from './List.css';

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
        completedRegistration: user.completedRegistration,
        registeredDate: user.registered,
      },
      id: user.id,
      permissions: user.permissions,
      setPermissions: user.setPermissions,
    }))];

  const columns = [{
    Header: `Name (${totalUsers})`,
    accessor: 'name',
    },{
    Header: `Registrert (${usersRegistered})`,
    accessor: 'registered',
    className: css.center,
    Cell: props =>
      <div
        className={classNames(css.action,
          {
            [css.success]: props.value.completedRegistration,
            [css.close]: !props.value.completedRegistration,
            [css.toggle]: props.value.completedRegistration,
          },
            )}
        title={`${moment(props.value.registeredDate).format('LLL')} (${moment(props.value.registeredDate).fromNow()})`}
      >{props.value.completedRegistration}</div>,
  }, {
    Header: `Rettigheter (${usersHasPermsToVote})`,
    accessor: 'permissions',
    Cell: props => getPermissionDisplay(props.value),
  }, {
    Header: `Stemmeberettigelse (${usersCanVote}/${usersHasPermsToVote})`,
    accessor: 'canVote',
    className: css.center,
    Cell: props =>
      <ToggleCanVoteContainer
        canVote={props.value}
        id={props.original.id}
        permissions={props.original.permissions}
        setPermissions={props.original.setPermissions}
        toggleCanVote={toggleCanVote}
      />,
  }];

  return (
    <ReactTable
      data={data}
      columns={columns}
      className={css.table}
      getTrProps={(state, rowInfo, column, instance) => ({
        className: classNames({
          [css.canNotVote]: !(rowInfo && rowInfo.row.canVote),
        }),
      })}
      getTdProps={() => ({
        className: css.tableCell,
      })}
      resizable={false}
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
