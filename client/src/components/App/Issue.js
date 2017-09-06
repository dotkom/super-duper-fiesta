import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { getIssueText } from '../../selectors/issues';
import Card from '../Card';
import css from './Issue.css';

const Issue = ({ text }) => (
  <DocumentTitle title={text}>
    <Card
      classes={css.issue}
      subtitle="Aktiv sak"
    >
      <p>{text}</p>
      {text === Issue.defaultProps.text && (
        <div className={css.loader}>
          <div className={classNames(css.loaderPart, css.loaderFirst)} />
          <div className={classNames(css.loaderPart, css.loaderSecond)} />
          <div className={css.loaderBlend} />
        </div>
      )}
    </Card>
  </DocumentTitle>
);

Issue.defaultProps = {
  text: 'Ingen aktiv sak for øyeblikket.',
};

Issue.propTypes = {
  text: React.PropTypes.string,
};


const mapStateToProps = state => ({
  text: getIssueText(state),
});

export default Issue;
export const IssueContainer = connect(
  mapStateToProps,
)(Issue);
