import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotAppContainer } from 'react-hot-loader';
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import IO from 'socket.io-client';
import createSocketIoMiddleware from 'redux-socket.io';
import logger from 'redux-logger';
import 'normalize.css';
import Raven from 'raven-js';

import votingApp from './reducers';
import Routes from './routes';
import rootSaga from './sagas';

moment.locale('nb');

Raven
    .config(process.env.SDF_SENTRY_DSN_FRONTEND, {
      tags: {
        app: 'frontend',
      },
    })
    .install();

const socket = IO.connect();

const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');
const sagaMiddleware = createSagaMiddleware();

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  votingApp,
  composeEnhancers(applyMiddleware(socketIoMiddleware, sagaMiddleware, logger)),
);

sagaMiddleware.run(rootSaga);

const render = (RootRoute) => {
  ReactDOM.render(
    <HotAppContainer>
      <RootRoute store={store} />
    </HotAppContainer>,
    document.getElementById('app'),
  );
};

render(Routes);

if (module.hot) {
  module.hot.accept('./routes', () => {
    render(Routes);
  });
}
