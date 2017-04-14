import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { AppContainer } from './components/App/';
import AppHome from './components/App/Home';
import { SetupContainer } from './components/App/Setup';
import { AdminPanelContainer } from './components/Admin/AdminPanel';
import AdminHome from './components/Admin/Home';
import { IssueFormContainer } from './components/Admin/IssueForm';
import Users from './components/Admin/Users';
import NotFound from './components/NotFound';

const Routes = ({ store, browserHistory }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={AppHome} />
        <Route path="register" component={SetupContainer} />
      </Route>

      { /* We might want to split this up into two seperate apps */ }
      <Route path="admin" component={AdminPanelContainer}>
        <IndexRoute component={AdminHome} />
        <Route path="question" component={IssueFormContainer} />
        <Route path="users" component={Users} />
      </Route>

      <Route path="*" component={NotFound} />
    </Router>
  </Provider>
);

Routes.propTypes = {
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  browserHistory: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Routes;
