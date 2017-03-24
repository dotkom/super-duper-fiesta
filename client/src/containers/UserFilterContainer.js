import { connect } from 'react-redux';
import UserFilter from '../components/Admin/Users/Filter';
import setUserFilter from '../actionCreators/setUserFilter';

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
