import React from 'react';
import { connect } from 'react-redux';
import IssueStatus from '../IssueStatus';
import { VotingMenuContainer } from './VotingMenu';
import { IssueContainer } from './Issue';
import { ConcludedIssueListContainer } from '../ConcludedIssueList';
import { activeIssueExists } from '../../selectors/issues';
import css from '../../css/Home.css';

const Home = ({ issueExists }) => (
  <div>
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
  issueExists: React.PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  issueExists: activeIssueExists(state),
});


export default Home;
export const HomeContainer = connect(
  mapStateToProps,
)(Home);
