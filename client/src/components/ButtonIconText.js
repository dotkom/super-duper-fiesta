import React, { Component, PropTypes } from 'react';
import IconText from './IconText';
import css from './ButtonIconText.css';

class ButtonIconText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovering: false,
    };
  }

  hover(hovering) {
    this.setState({
      hovering,
    });
  }

  render() {
    const { onClick, ...other } = this.props;
    const { hovering } = this.state;
    return (
      <button
        className={css.button}
        onClick={onClick}
        onMouseEnter={() => this.hover(true)}
        onMouseLeave={() => this.hover(false)}
        {...other}
      >
        <IconText hovering={hovering} {...other} />
      </button>
    );
  }
}

ButtonIconText.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ButtonIconText;
