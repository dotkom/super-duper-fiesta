import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = state => ({
  title: state.meeting.title,
});

export default connect(
  mapStateToProps,
)(App);
