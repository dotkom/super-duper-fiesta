import { connect } from 'react-redux';
import AdminPanel from '../components/AdminPanel';
import { toggleRegistration } from '../actions/adminButtons';
import { createIssue } from '../actions/issues';

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
