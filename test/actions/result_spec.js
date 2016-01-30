import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../../src/js/actions/result';
import nock from 'nock';
import resources from '../../src/js/resources';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const initialState = {
  results: {
    articles: {
      isFetching: false,
      items: [],
      metadata: {},
      aggregations: {}
    }
  },
  filters: {
    isFetching: false,
    items: {}
  }
};

describe('result', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('creates RECEIVE_RESULTS & RECEIVE_FILTERS when fetching resource has been done', (done) => {
    nock('http://www.example.com')
      .get('/todos')
      .reply(200, { results: [{ id: '1', title: 'result #1' }], total: 1 });

    const expectedActions = [
      { type: actions.REQUEST_FILTERS },
      { type: actions.RECEIVE_FILTERS },
      { type: actions.REQUEST_RESULTS },
      { type: actions.RECEIVE_RESULTS, payload: { results: [] } }
    ];
    const store = mockStore(initialState, expectedActions);
    store.dispatch(actions.fetchResults({}, resources[1]));
  });
});