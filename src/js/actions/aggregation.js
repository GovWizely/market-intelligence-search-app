import _ from 'lodash';
import assign from 'object-assign';
import axios from 'axios';
import Parser from '../utils/aggregation-parser';

export const REQUEST_AGGREGATIONS = 'REQUEST_AGGREGATIONS';
export const RECEIVE_AGGREGATIONS = 'RECEIVE_AGGREGATIONS';

const endpoint = 'https://pluto.kerits.org/v1/articles/count?q=';

function isFiltering(query) {
  const keys = Object.keys(query).map(k => k);
  for (let key in keys) {
    if (keys[key].split('-')[0] === 'filter') return true;
  }
  return false;
}

function requestAggregations() {
  return {
    type: REQUEST_AGGREGATIONS
  };
}

function receiveAggregations(response) {
  return {
    type: RECEIVE_AGGREGATIONS,
    aggregations: response
  };
}

export function fetchAggregations() {
  return (dispatch, getState) => {
    if (getState().aggregations.isFetching) return null;

    dispatch(requestAggregations());
    return axios.get(endpoint)
      .then(function(response) {
        let aggregations = {};
        aggregations.countries = response.data.aggregations.countries;
        aggregations.industries = Parser.parse(response.data.aggregations.industries);
        aggregations.topics = Parser.parse(response.data.aggregations.topics);
        dispatch(receiveAggregations(aggregations));
      });
  };
}