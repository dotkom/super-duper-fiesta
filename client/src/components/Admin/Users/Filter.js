import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import setUserFilter from '../../../actionCreators/setUserFilter';
import css from './Filter.css';

const UserFilter = ({ filter, onChange }) => (
  <div className={css.filter}>
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
