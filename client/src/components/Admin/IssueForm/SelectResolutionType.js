import React, { PropTypes } from 'react';

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

export default SelectResolutionType;
