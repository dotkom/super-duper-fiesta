import { connect } from 'react-redux';
import AdminPanel from '../components/AdminPanel';
import { toggleRegistration } from '../actions/adminButtons';

const mapStateToProps = ({ registrationEnabled }) => ({
  registrationEnabled,
});

const mapDispatchToProps = dispatch => ({
  toggleRegistration: () => {
    dispatch(toggleRegistration());
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPanel);
