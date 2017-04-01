import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import setUserFilter from '../../../actionCreators/setUserFilter';

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

const mapStateToProps = state => ({
  filter: state.userFilter,
});

const mapDispatchToProps = dispatch => ({
  onChange: (filter) => {
    dispatch(setUserFilter(filter));
  },
});

export default UserFilter;
export const UserFilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserFilter);
