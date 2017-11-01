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
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

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

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userSettings'],
};

const socket = IO.connect();

const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');
const sagaMiddleware = createSagaMiddleware();

let middleware = [socketIoMiddleware, sagaMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, logger];
}

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  persistCombineReducers(persistConfig, votingApp),
  (process.env.NODE_ENV !== 'production')
    ? composeEnhancers(applyMiddleware(...middleware))
    : applyMiddleware(...middleware),
);
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

const render = (RootRoute) => {
  ReactDOM.render(
    <HotAppContainer>
      <RootRoute store={store} persistor={persistor} />
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
