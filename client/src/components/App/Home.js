import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { activeIssueExists } from 'features/issue/selectors';
import IssueStatus from '../IssueStatus';
import { VotingMenuContainer } from './VotingMenu';
import { IssueContainer } from './Issue';
import LatestConcludedIssue from '../LatestConcludedIssue';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import UserSettings from '../UserSettings';
import css from '../../css/Home.css';

const Home = ({ issueExists, registered }) => (
  <div>
    { registered === false && <Redirect to="/register" />}
    <div className={css.components}>
      <div className={css.voteWrapper}>
        <IssueContainer />
        <VotingMenuContainer />
      </div>
      { issueExists && <IssueStatus /> }
    </div>
    <div className={css.components}>
      <div className={css.latestIssue}>
        <LatestConcludedIssue />
      </div>
      <UserSettings />
    </div>
    <ConcludedIssueListContainer />
  </div>
);

Home.defaultProps = {
  registered: undefined,
};

Home.propTypes = {
  issueExists: PropTypes.bool.isRequired,
  registered: PropTypes.bool,
};

const mapStateToProps = state => ({
  issueExists: activeIssueExists(state),
  registered: state.auth.registered,
});


export default Home;
export const HomeContainer = connect(
  mapStateToProps,
)(Home);
