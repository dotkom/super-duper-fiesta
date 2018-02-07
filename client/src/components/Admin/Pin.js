import React, { PropTypes } from 'react';

const Pin = ({ code }) => (
  <div>
    <b>Gjeldende PIN kode</b>: {code}
  </div>
);

Pin.propTypes = {
  code: PropTypes.number.isRequired,
};

export default Pin;
