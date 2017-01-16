import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { createStore } from 'redux';
import AdminPanelContainer from './containers/AdminPanelContainer';
import App from './components/App';
import AdminHome from './components/AdminHome';
import IssueForm from './components/IssueForm';
import Users from './components/Users';
import votingApp from './reducers';

const store = createStore(votingApp);

store.subscribe(() => {
  console.log('Store updated:', store.getState());
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App} />

      { /* We might want to split this up into two seperate apps */ }
      <Route path="admin" component={AdminPanelContainer}>
        <IndexRoute component={AdminHome} />
        <Route path="question" component={IssueForm} />
        <Route path="users" component={Users} />
      </Route>
    </Router>
  </Provider>,

  document.getElementById('app'),
);
