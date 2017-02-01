import { connect } from 'react-redux';
import UserFilter from '../components/UserFilter';
import setUserFilter from '../actions/setUserFilter';

const mapStateToProps = state => ({
  filter: state.userFilter,
});

const mapDispatchToProps = dispatch => ({
  onChange: (filter) => {
    dispatch(setUserFilter(filter));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserFilter);
