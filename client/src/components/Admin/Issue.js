import React from 'react';
import { connect } from 'react-redux';
import Button from '../Button';
import Card from '../Card';
import IconText from '../IconText';
import Pin from './Pin';
import { adminCloseIssue } from '../../actionCreators/adminButtons';
import { getIssueText, activeIssueExists, getIssue } from '../../selectors/issues';
import css from '../../css/IssueAdmin.css';

const Issue = ({ closeIssue, allowClosing, issueText }) => (
  <Card classes={css.issue}>
    <div>
      <Pin code="DEADBEEF" />
      <p className={css.title}>Aktiv sak</p>
    </div>
    <div className={css.actions}>
      <Button>
        <IconText text="Rediger" iconClass="flaticon-edit" />
      </Button>
      <Button>
        <IconText text="Resett" iconClass="flaticon-refresh" />
      </Button>
      <Button onClick={closeIssue} hidden={!allowClosing}>
        <IconText text="Avslutt" iconClass="flaticon-lock" />
      </Button>
      <Button>
        <IconText text="Slett" iconClass="flaticon-cross" />
      </Button>
    </div>
    <p className="IssueAdmin-text">{issueText}</p>
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
