import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Button from '../Button';
import Card from '../Card';
import Dialog from '../Dialog';
import ButtonIconText from '../ButtonIconText';
import Pin from './Pin';
import { adminCloseIssue, adminDeleteIssue } from '../../actionCreators/adminButtons';
import { getIssueText, activeIssueExists, getIssue } from '../../selectors/issues';
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

  render() {
    const {
      closeIssue, issueIsActive, issueText, pin, registrationOpen,
    } = this.props;
    const { showCloseIssueDialog } = this.state;
    return (
      <Card classes={css.issue}>
        {this.state.redirectToEditIssue && <Redirect to="/admin/question" />}
        <Dialog
          title="Bekreft sletting av sak"
          subtitle={`Bekreft sletting av "${issueText}"`}
          visible={showCloseIssueDialog}
        >
          <Button background onClick={() => this.deleteIssue()}>Bekreft</Button>
          <Button
            background
            onClick={() => { this.setState({ showCloseIssueDialog: false }); }}
          >Avbryt</Button>
        </Dialog>
        <div className={css.content}>
          <div>
            <Pin code={registrationOpen ? pin : 'Registreringen er ikke åpen.'} />
            <p className={css.title}>Aktiv sak</p>
          </div>
          {issueIsActive && <div className={css.actions}>
            <ButtonIconText
              text="Rediger"
              iconClass={css.edit}
              onClick={() => { this.setState({ redirectToEditIssue: true }); }}
            />
            <ButtonIconText text="Resett" iconClass={css.reset} />
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
  registrationOpen: false,
};

Issue.propTypes = {
  closeIssue: React.PropTypes.func.isRequired,
  deleteIssue: React.PropTypes.func.isRequired,
  issueIsActive: React.PropTypes.bool.isRequired,
  issueText: React.PropTypes.string.isRequired,
  pin: React.PropTypes.number,
  registrationOpen: React.PropTypes.bool,
};

const mapStateToProps = state => ({
  issueIsActive: activeIssueExists(state),
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
  };
};

export default Issue;
export const IssueContainer = connect(
  mapStateToProps,
  null,
  mergeProps,
)(Issue);
