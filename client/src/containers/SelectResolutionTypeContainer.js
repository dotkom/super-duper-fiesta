import { connect } from 'react-redux';
import SelectResolutionType from '../components/SelectResolutionType';
import { setResolutionType } from '../actions/createIssueForm';

const mapStateToProps = state => ({
  resolutionType: state.resolutionType,
});

const mapDispatchToProps = dispatch => ({
  handleResolutionTypeChange: (resolutionType) => {
    dispatch(setResolutionType(resolutionType));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectResolutionType);
