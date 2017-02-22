import React, { PropTypes } from 'react';

class IssueFormAlternative extends React.Component {
  constructor() {
    super();

    this.handleAddAlternative = this.handleAddAlternative.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleAddAlternative() {
    if (this.props.alternativeText) {
      this.props.addAlternative(this.props.alternativeText);
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleAddAlternative();
    }
  }

  render() {
    const {
      display,
      alternativeText,
      alternativeUpdate,
      alternatives,
      removeAlternative,
    } = this.props;

    return display && (
      <div className="IssueFormAlternative">
        <ul>
          {alternatives.map(alternative =>
            <li key={alternative.id}>
              {alternative.text}
              <button
                onClick={() => removeAlternative(alternative.id)}
              >Fjern</button>
            </li>,
          )}
        </ul>

        <label className="IssueForm-radios">
          <input
            type="text"
            value={alternativeText}
            onChange={e => alternativeUpdate(e.target.value)}
            onKeyPress={this.handleKeyPress}
          />

          <button onClick={this.handleAddAlternative}>Add</button>
        </label>
      </div>
    );
  }
}

IssueFormAlternative.propTypes = {
  alternativeText: PropTypes.string.isRequired,
  alternativeUpdate: PropTypes.func.isRequired,
  display: PropTypes.bool.isRequired,
  addAlternative: PropTypes.func.isRequired,
  removeAlternative: PropTypes.func.isRequired,
  alternatives: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
};

export default IssueFormAlternative;
