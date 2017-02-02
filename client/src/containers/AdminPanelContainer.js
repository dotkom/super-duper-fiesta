import { connect } from 'react-redux';
import AdminPanel from '../components/AdminPanel';
import { createIssue, toggleRegistration } from '../actions/adminButtons';

const mapStateToProps = ({ registrationEnabled }) => ({
  registrationEnabled,
});

const mapDispatchToProps = dispatch => ({
  toggleRegistration: () => {
    dispatch(toggleRegistration());
  },
  createIssue: () => {
    dispatch(createIssue({
      description: 'My Q',
      options: [
        { text: 'Jakob' },
        { text: 'Hallo' },
        { text: 'LUL' },
      ],
      voteDemand: 0.5,
    }));
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPanel);
