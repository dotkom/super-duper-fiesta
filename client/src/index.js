import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { applyMiddleware, createStore } from 'redux';
import IO from 'socket.io-client';
import createSocketIoMiddleware from 'redux-socket.io';
import AdminPanelContainer from './containers/AdminPanelContainer';
import AppContainer from './containers/AppContainer';
import AdminHome from './components/Admin/Home';
import IssueFormContainer from './containers/IssueFormContainer';
import NotFound from './components/NotFound';
import Users from './components/Admin/Users';
import votingApp from './reducers';

const socket = IO.connect();

const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

const store = applyMiddleware(socketIoMiddleware)(createStore)(votingApp);

store.subscribe(() => {
  console.log('Store updated:', store.getState());
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AppContainer} />

      { /* We might want to split this up into two seperate apps */ }
      <Route path="admin" component={AdminPanelContainer}>
        <IndexRoute component={AdminHome} />
        <Route path="question" component={IssueFormContainer} />
        <Route path="users" component={Users} />
      </Route>

      <Route path="*" component={NotFound} />
    </Router>
  </Provider>,

  document.getElementById('app'),
);
