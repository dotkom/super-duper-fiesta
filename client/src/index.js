import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotAppContainer } from 'react-hot-loader';
import { applyMiddleware, createStore, compose } from 'redux';
import IO from 'socket.io-client';
import createSocketIoMiddleware from 'redux-socket.io';
import logger from 'redux-logger';
import 'normalize.css';
import Raven from 'raven-js';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import votingApp from './features/reducers';
import Routes from './routes';
import { sagaMiddleware, runSaga } from './features/sagas';

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

const socketIoConfig = [
  {
    // Special listener used for initial connection auth
    prefix: 'auth/',
    eventName: 'auth',
  },
  {
    // Admin listener
    prefix: 'admin/',
    eventName: 'admin',
  },
  {
    // Default listener
    prefix: 'server/',
    eventName: 'action',
  },
];

const socketIoMiddlewares = socketIoConfig.map(({ prefix, eventName }) => (
  createSocketIoMiddleware(socket, prefix, { eventName })
));

let middleware = [...socketIoMiddlewares, sagaMiddleware];
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

runSaga();

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

OfflinePluginRuntime.install({
  onUpdateReady: () => {
    // Tells to new SW to take control immediately
    OfflinePluginRuntime.applyUpdate();
  },
});
