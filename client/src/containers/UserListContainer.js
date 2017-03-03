import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import UserList from '../components/UserList';
import { toggleCanVote } from '../actionCreators/users';

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserList);
