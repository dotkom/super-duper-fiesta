import React from 'react';
import classNames from 'classnames';
import '../css/ConcludedIssue.css';


class ConcludedIssue extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visibleAlternatives: false,
      majority: this.calculateMajority(props.alternatives, props.votes, props.majorityTreshold),
    }
    this.handleClick = this.handleClick.bind(this);
  }


  // Maps over alternatives to see if any of them got majority vote
  calculateMajority(alternatives, votes, majorityTreshold) {
    let majority = false;
    alternatives.map(function(alternative){
      if (votes
        .filter(vote => vote.alternative === alternative.id)
        .length / votes.length >= majorityTreshold) {
        majority = true
      }
    });
    return majority;
  }


  // CLicking the issue should show/hide the answers
  handleClick() {
    this.setState({
      visibleAlternatives: !this.state.visibleAlternatives,
    });
  }


  render() {
    console.log(this.state.visibleAlternatives)
    return (
      <div className={classNames("ConcludedIssue", {'ConcludedIssue-NotMajority': this.state.majority})} onClick={this.handleClick}>
        <p>{this.props.text}</p>
        <ul className={classNames({"hidden": !this.state.visibleAlternatives})}>
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
