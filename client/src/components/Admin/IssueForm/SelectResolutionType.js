import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setResolutionType } from '../../../actionCreators/createIssueForm';


const SelectResolutionType = ({ resolutionType, handleResolutionTypeChange }) => (
  <select
    onChange={e => handleResolutionTypeChange(parseInt(e.target.value, 10))}
    value={resolutionType}
  >
    <option value={0}>Alminnelig flertall (1/2)</option>
    <option value={1}>Kvalifisert flertall (2/3)</option>
  </select>
);

SelectResolutionType.propTypes = {
  handleResolutionTypeChange: PropTypes.func.isRequired,
  resolutionType: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  resolutionType: state.resolutionType,
});

const mapDispatchToProps = dispatch => ({
  handleResolutionTypeChange: (resolutionType) => {
    dispatch(setResolutionType(resolutionType));
  },
});


export default SelectResolutionType;
export const SelectResolutionTypeContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectResolutionType);
