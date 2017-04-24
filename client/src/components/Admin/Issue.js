import React from 'react';
import { connect } from 'react-redux';
import Card from '../Card';
import ButtonIconText from '../ButtonIconText';
import Pin from './Pin';
import { adminCloseIssue } from '../../actionCreators/adminButtons';
import { getIssueText, activeIssueExists, getIssue } from '../../selectors/issues';
import css from './Issue.css';

const Issue = ({ closeIssue, issueIsActive, issueText, pin, registrationOpen }) => (
  <Card classes={css.issue}>
    <div className={css.content}>
      <div>
        <Pin code={registrationOpen ? pin : 'Registreringen er ikke åpen.'} />
        <p className={css.title}>Aktiv sak</p>
      </div>
      {issueIsActive && <div className={css.actions}>
        <ButtonIconText text="Rediger" iconClass={css.edit} />
        <ButtonIconText text="Resett" iconClass={css.reset} />
        <ButtonIconText text="Avslutt" iconClass={css.end} onClick={closeIssue} />
        <ButtonIconText text="Slett" iconClass={css.delete} />
      </div>
      }
    </div>
    <p>{issueText}</p>
  </Card>
);

Issue.defaultProps = {
  pin: 0,
  registrationOpen: false,
};

Issue.propTypes = {
  closeIssue: React.PropTypes.func.isRequired,
  issueIsActive: React.PropTypes.bool.isRequired,
  issueText: React.PropTypes.string.isRequired,
  pin: React.PropTypes.number,
  registrationOpen: React.PropTypes.boolean,
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
  };
};

export default Issue;
export const IssueContainer = connect(
  mapStateToProps,
  null,
  mergeProps,
)(Issue);
