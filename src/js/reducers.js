import { reject } from 'lodash';
import assign from 'object-assign';
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routeReducer } from 'redux-simple-router';

import {
  REQUEST_RESULTS, RECEIVE_RESULTS, FAILURE_RESULTS } from './actions/result';
import { INVALIDATE_FILTERS, REQUEST_FILTERS, RECEIVE_FILTERS } from './actions/filter';
import { UPDATE_WINDOW } from './actions/window';
import { UPDATE_QUERY, REPLACE_QUERY } from './actions/query';
import { SELECT_APIS } from './actions/api';
import { ADD_NOTIFICATION, DISMISS_NOTIFICATION } from './actions/notification';

function apis(state = {}) {
  return state;
}

function filters(state = {
  invalidated: false,
  isFetching: false,
  items: {}
}, action) {
  switch (action.type) {
  case REQUEST_FILTERS:
    return assign({}, state, {
      isFetching: true,
      invalidated: false
    });
  case RECEIVE_FILTERS:
    return assign({}, state, {
      isFetching: false,
      invalidated: false,
      items: action.payload
    });
  case INVALIDATE_FILTERS:
    return assign({}, state, {
      invalidated: true
    });
  default:
    return state;
  }
}

function filtersByAggregation(state = {}, action) {
  switch (action.type) {
  case REQUEST_FILTERS:
  case RECEIVE_FILTERS:
  case INVALIDATE_FILTERS:
    return assign({}, state, { [action.meta]: filters(state[action.meta], action) });
  default:
    return state;
  }
}

function notifications(state = [], action) {
  const _state = assign([], state);
  switch (action.type) {
  case ADD_NOTIFICATION:
    return _state.concat(action.payload);
  case DISMISS_NOTIFICATION:
    return reject(state, { id: action.payload });
  default:
    return _state;
  }
}

function query(state = { q: '' }, action) {
  switch (action.type) {
  case UPDATE_QUERY:
    return assign({}, state, action.payload);
  case REPLACE_QUERY:
    return action.payload;
  default:
    return state;
  }
}

function results(state = {
  aggregations: {},
  invalidated: false,
  isFetching: false,
  items: [], metadata: {}
}, action) {
  switch (action.type) {
  case REQUEST_RESULTS:
    return assign({}, state, {
      isFetching: true
    });
  case RECEIVE_RESULTS:
    return assign({}, state, {
      isFetching: false,
      items: action.payload.results,
      metadata: action.payload.metadata,
      aggregations: action.payload.aggregations
    });
  case FAILURE_RESULTS:
    return assign({}, state, {
      isFetching: false
    });
  default:
    return state;
  }
}

function resultsByAPI(state = {}, action) {
  switch (action.type) {
  case REQUEST_RESULTS:
  case RECEIVE_RESULTS:
  case FAILURE_RESULTS:
    return assign({}, state, { [action.meta]: results(state[action.meta], action) });
  case UPDATE_QUERY:
  case REPLACE_QUERY:
    return {};
  default:
    return state;
  }
}

function selectedAPIs(state = [], action) {
  switch (action.type) {
  case SELECT_APIS:
    return action.payload;
  default:
    return state;
  }
}

function window(state = {}, action) {
  switch (action.type) {
  case UPDATE_WINDOW:
    return assign({}, state, action.payload);
  default:
    return state;
  }
}

const reducer = combineReducers({
  apis,
  filtersByAggregation,
  form,
  notifications,
  query,
  resultsByAPI,
  routing: routeReducer,
  selectedAPIs,
  window
});

export default reducer;
