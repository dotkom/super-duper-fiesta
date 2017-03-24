import { connect } from 'react-redux';
import AdminPanel from '../components/Admin/Panel';
import { toggleRegistration } from '../actionCreators/adminButtons';

const mapStateToProps = ({ registrationEnabled }) => ({
  registrationEnabled,
});

const mapDispatchToProps = dispatch => ({
  toggleRegistration: () => {
    dispatch(toggleRegistration());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPanel);
