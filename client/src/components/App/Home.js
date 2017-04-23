import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import IssueStatus from '../IssueStatus';
import { VotingMenuContainer } from './VotingMenu';
import { IssueContainer } from './Issue';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import { activeIssueExists } from '../../selectors/issues';
import css from '../../css/Home.css';

const Home = ({ issueExists, registered }) => (
  <div>
    { !registered && <Redirect to="/register" />}
    <div className={css.components}>
      <div className={css.voteWrapper}>
        <IssueContainer />
        <VotingMenuContainer />
      </div>
      { issueExists && <IssueStatus /> }
    </div>
    <ConcludedIssueListContainer />
  </div>
);

Home.propTypes = {
  issueExists: PropTypes.bool.isRequired,
  registered: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  issueExists: activeIssueExists(state),
  registered: state.auth.registered,
});


export default Home;
export const HomeContainer = connect(
  mapStateToProps,
)(Home);
