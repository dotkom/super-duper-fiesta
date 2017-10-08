import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotAppContainer } from 'react-hot-loader';
import { applyMiddleware, createStore } from 'redux';
import IO from 'socket.io-client';
import createSocketIoMiddleware from 'redux-socket.io';
import logger from 'redux-logger';
import 'normalize.css';
import Raven from 'raven-js';

import votingApp from './reducers';
import Routes from './routes';

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

const store = applyMiddleware(socketIoMiddleware, logger)(createStore)(votingApp);

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
