import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { AppContainer } from './components/App/';
import { AdminPanelContainer } from './components/Admin/AdminPanel';
import './css/base.css';

const Routes = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        { /* We might want to split this up into two seperate apps */ }
        <Route path="/admin" component={AdminPanelContainer} />
        <Route path="/" component={AppContainer} />
      </Switch>
    </Router>
  </Provider>
);

Routes.propTypes = {
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Routes;
