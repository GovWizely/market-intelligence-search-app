require('./scss/style.scss');
require('./scss/animate.min.css');
require('babel-polyfill');
require('es6-promise').polyfill();

import React from 'react';
import { render } from 'react-dom';
import { createHashHistory as createHistory } from 'history';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import { syncReduxAndRouter } from 'redux-simple-router';

import App from './js/containers/app';
import Index from './js/containers/index';
import Search from './js/containers/search';
import configureStore from './js/store/configureStore';

const history = createHistory({ });
const store = configureStore();

syncReduxAndRouter(history, store);

render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route component={ App }>
        <Route path="/" component={ Index } />
        <Route path="search(/:api)" component={ Search } />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('main')
);
