import React from 'react';
import classNames from 'classnames';
import '../css/ConcludedIssue.css';


class ConcludedIssue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleAlternatives: false,
    }
  }

  handleClick() {
    this.setState({
      visibleAlternatives: this.state.visibleAlternatives,
    })
  }


  render() {
    return (
      <div className="ConcludedIssue">
        <p>{this.props.text}</p>
        <ul>
          {this.props.alternatives.map(alternative => (
            <li
              key={alternative.id}
              className={classNames({
                winner: this.props.votes.length && this.props.votes
                  .filter(vote => vote.alternative === alternative.id)
                  .length / this.props.votes.length >= this.props.majorityTreshold,
              })}
            >
              {alternative.text}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}


export default ConcludedIssue;
