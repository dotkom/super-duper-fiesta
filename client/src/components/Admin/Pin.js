import React from 'react';
import PropTypes from 'prop-types';

const Pin = ({ code }) => (
  <div>
    <b>Gjeldende PIN kode</b>: {code}
  </div>
);

Pin.propTypes = {
  code: PropTypes.number.isRequired,
};

export default Pin;
