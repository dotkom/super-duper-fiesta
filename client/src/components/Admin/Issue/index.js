import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { VOTING_NOT_STARTED, VOTING_IN_PROGRESS, VOTING_FINISHED } from 'common/actionTypes/issues';
import {
  adminCloseIssue,
  adminDeleteIssue,
  enableVoting,
  disableVoting,
} from 'features/adminButtons/actionCreators';
import { getIssueText, activeIssueExists, getIssue, getIssueKey } from 'features/issue/selectors';
import Button from '../../Button';
import Card from '../../Card';
import Dialog from '../../Dialog';
import ButtonIconText from '../../ButtonIconText';
import Pin from '../Pin';
import css from './Issue.css';

class Issue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToEditIssue: false,
      showCloseIssueDialog: false,
    };
  }

  onClickDeleteIssue() {
    this.setState({ showCloseIssueDialog: true });
  }

  deleteIssue() {
    this.setState({ showCloseIssueDialog: false });
    this.props.deleteIssue();
  }

  votingBtnOnClick() {
    if (this.props.issueStatus === VOTING_NOT_STARTED) {
      this.props.enableVoting();
    } else {
      this.props.disableVoting();
    }
  }

  closeDeleteDialog() {
    this.setState({ showCloseIssueDialog: false });
  }

  render() {
    const {
      closeIssue, issueIsActive, issueStatus, issueText, pin, registrationOpen,
    } = this.props;
    const { showCloseIssueDialog } = this.state;
    const votingInProgress = issueStatus === VOTING_IN_PROGRESS;
    let enableDisableVotingBtnText;
    if (issueStatus === VOTING_NOT_STARTED) enableDisableVotingBtnText = 'Start votering';
    else if (issueStatus === VOTING_IN_PROGRESS) enableDisableVotingBtnText = 'Avslutt votering';
    else enableDisableVotingBtnText = 'Votering er ferdig';
    return (
      <Card classes={css.issue}>
        {this.state.redirectToEditIssue && <Redirect to="/admin/question" />}
        <Dialog
          title="Bekreft sletting av sak"
          subtitle={`Bekreft sletting av "${issueText}"`}
          visible={showCloseIssueDialog}
          onClose={() => this.closeDeleteDialog()}
        >
          <Button background onClick={() => this.deleteIssue()}>Bekreft</Button>
          <Button
            background
            onClick={() => this.closeDeleteDialog()}
          >Avbryt</Button>
        </Dialog>
        <div className={css.content}>
          <div>
            <Pin code={registrationOpen ? pin : 'Registreringen er ikke åpen.'} />
            <p className={css.title}>Aktiv sak</p>
          </div>
          {issueIsActive && <div className={css.actions}>
            <ButtonIconText
              text={enableDisableVotingBtnText}
              iconClass={votingInProgress || issueStatus === VOTING_FINISHED
                ? css.lock : css.unlock}
              onClick={() => this.votingBtnOnClick()}
              disabled={this.props.issueStatus === VOTING_FINISHED}
            />
            <ButtonIconText
              text="Rediger"
              iconClass={css.edit}
              onClick={() => { this.setState({ redirectToEditIssue: true }); }}
            />
            <ButtonIconText text="Avslutt" iconClass={css.end} onClick={closeIssue} />
            <ButtonIconText
              text="Slett"
              iconClass={css.delete}
              onClick={() => this.onClickDeleteIssue()}
            />
          </div>
          }
        </div>
        <p>{issueText}</p>
      </Card>
    );
  }
}

Issue.defaultProps = {
  pin: 0,
  issueStatus: VOTING_NOT_STARTED,
  registrationOpen: false,
};

Issue.propTypes = {
  closeIssue: PropTypes.func.isRequired,
  deleteIssue: PropTypes.func.isRequired,
  disableVoting: PropTypes.func.isRequired,
  enableVoting: PropTypes.func.isRequired,
  issueIsActive: PropTypes.bool.isRequired,
  issueStatus: PropTypes.string,
  issueText: PropTypes.string.isRequired,
  pin: PropTypes.number,
  registrationOpen: PropTypes.bool,
};

const mapStateToProps = state => ({
  issueIsActive: activeIssueExists(state),
  issueStatus: getIssueKey(state, 'status'),
  issueText: getIssueText(state),
  issue: getIssue(state),
  pin: state.meeting.pin,
  registrationOpen: state.meeting.registrationOpen,
});

// Following this example since we need id from state
// https://github.com/reactjs/react-redux/issues/237#issuecomment-168817739
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  return {
    ...ownProps,
    ...stateProps,
    closeIssue: () => {
      dispatch(adminCloseIssue({ issue: stateProps.issue.id }));
    },
    deleteIssue: () => {
      dispatch(adminDeleteIssue({ issue: stateProps.issue.id }));
    },
    disableVoting: () => {
      dispatch(disableVoting({ issue: stateProps.issue.id }));
    },
    enableVoting: () => {
      dispatch(enableVoting({ issue: stateProps.issue.id }));
    },
  };
};

export default Issue;
export const IssueContainer = connect(
  mapStateToProps,
  null,
  mergeProps,
)(Issue);
