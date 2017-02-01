import React, { PropTypes } from 'react';

const UserFilter = ({ filter, onChange }) => (
  <div className="UserFilter">
    <label>
      Filtrer brukere: <input
        type="text"
        value={filter}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  </div>
);

UserFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default UserFilter;
