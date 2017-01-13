import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import votingApp from './reducers';

let store = createStore(votingApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,

  document.getElementById('app'),
);
