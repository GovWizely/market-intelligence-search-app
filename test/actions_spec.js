import { expect } from 'chai';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import nock from 'nock';

const middlewares = [ thunk ];

function mockStore(getState, expectedActions, done) {
  if (!Array.isArray(expectedActions)) {
    throw new Error('expectedActions should be an array of expected actions.');
  }
  if (typeof done !== 'undefined' && typeof done !== 'function') {
    throw new Error('done should either be undefined or function.');
  }

  function mockStoreWithoutMiddleware() {
    return {
      getState() {
        return typeof getState === 'function' ? getState() : getState;
      },

      dispatch(action) {
        const expectedAction = expectedActions.shift();
        try {
          expect(action).to.equal(expectedAction);
          if (done && !expectedActions.length) {
            done();
          }
        } catch(e) {
          done(e);
        }
      }
    };
  }

  const mockStoreWithMiddleware = applyMiddleware(
    ...middlewares
  )(mockStoreWithoutMiddleware);

  return mockStoreWithMiddleware();
}

import * as actions from '../src/js/actions';

describe('actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  const aggregations = {
    data: {
      countries: [],
      industries: [],
      topics: [],
      types: []
    }
  };

  describe('fetchAggregations', () => {
    it('create an action to request aggregations', (done) => {
      nock('https://pluto.kerits.org')
        .get('/v1/articles/count?q=')
        .reply(200, { aggregations });

      const expectedActions = [
        { type: actions.REQUEST_AGGREGATIONS },
        { type: actions.RECEIVE_AGGREGATIONS, aggregations }
      ];
      const store = mockStore({
        aggregations: { isFetching: false, data: {} }
      }, expectedActions, done);
      store.dispatch(actions.fetchAggregations());
    });
  });
});