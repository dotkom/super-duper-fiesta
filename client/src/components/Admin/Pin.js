import React, { PropTypes } from 'react';
import '../../css/Pin.css';

const Pin = ({ code }) => (
  <div className="Pin">
    <b>Gjeldende PIN kode</b>: {code}
  </div>
);

Pin.propTypes = {
  code: PropTypes.string.isRequired,
};

export default Pin;
