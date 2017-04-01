import React, { PropTypes } from 'react';


const SelectResolutionType = ({ resolutionType, handleResolutionTypeChange }) => (
  <select
    onChange={e => handleResolutionTypeChange(parseFloat(e.target.value, 10))}
    value={resolutionType}
  >
    <option value={1 / 2}>Alminnelig flertall (1/2)</option>
    <option value={2 / 3}>Kvalifisert flertall (2/3)</option>
  </select>
);

SelectResolutionType.propTypes = {
  handleResolutionTypeChange: PropTypes.func.isRequired,
  resolutionType: PropTypes.number.isRequired,
};

export default SelectResolutionType;
