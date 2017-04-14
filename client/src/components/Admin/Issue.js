import React from 'react';
import { connect } from 'react-redux';
import Card from '../Card';
import ButtonIconText from '../ButtonIconText';
import Pin from './Pin';
import { adminCloseIssue } from '../../actionCreators/adminButtons';
import { getIssueText, activeIssueExists, getIssue } from '../../selectors/issues';
import css from './Issue.css';

const Issue = ({ closeIssue, allowClosing, issueText }) => (
  <Card classes={css.issue}>
    <div className={css.content}>
      <div>
        <Pin code="DEADBEEF" />
        <p className={css.title}>Aktiv sak</p>
      </div>
      <div className={css.actions}>
        <ButtonIconText text="Rediger" iconClass={css.edit} />
        <ButtonIconText text="Resett" iconClass={css.reset} />
        <ButtonIconText
          onClick={closeIssue} hidden={!allowClosing}
          text="Avslutt" iconClass={css.end}
        />
        <ButtonIconText text="Slett" iconClass={css.delete} />
      </div>
    </div>
    <p>{issueText}</p>
  </Card>
);

Issue.propTypes = {
  closeIssue: React.PropTypes.func.isRequired,
  allowClosing: React.PropTypes.bool.isRequired,
  issueText: React.PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  allowClosing: activeIssueExists(state),
  issueText: getIssueText(state),
  issue: getIssue(state),
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
