import merge from 'deepmerge';
import { compact, isEmpty, keys, map, reduce } from 'lodash';

export const REQUEST_FILTERS = 'REQUEST_FILTERS';
export const RECEIVE_FILTERS = 'RECEIVE_FILTERS';
export const INVALIDATE_FILTERS = 'INVALIDATE_FILTERS';

export function requestFilters(aggregation) {
  return {
    type: REQUEST_FILTERS,
    meta: aggregation
  };
}

export function receiveFilters(aggregation, filters) {
  return {
    type: RECEIVE_FILTERS,
    meta: aggregation,
    payload: filters
  };
}

export function invalidateFilters(aggregation) {
  return {
    type: INVALIDATE_FILTERS,
    meta: aggregation
  };
}

export function invalidateSiblingFilters(root) {
  return (dispatch, getState) =>
    compact(map(getState().filtersByAggregation, (filters, key) => {
      if (key === root) return null;
      return dispatch(invalidateFilters(key));
    }));
}

export function invalidateAllFilters() {
  return (dispatch, getState) =>
    map(getState().filtersByAggregation, (filters, key) => dispatch(invalidateFilters(key)));
}

function computeFilters(responses, aggregation) {
  return (dispatch) => {
    dispatch(requestFilters(aggregation));
    const filters = reduce(
      responses,
      (output, response) => merge(output, response.aggregations[aggregation] || {}),
      {});
    dispatch(receiveFilters(aggregation, filters));
  };
}

function shouldComputeFilters(state, aggregation) {
  const filters = state.filtersByAggregation[aggregation];
  if (!filters || isEmpty(filters) || isEmpty(filters.items)) {
    return true;
  } else if (filters.isFetching) {
    return false;
  }
  return filters.invalidated;
}

function computeFiltersIfNeeded(responses, aggregation) {
  return (dispatch, getState) => {
    if (!shouldComputeFilters(getState(), aggregation)) return Promise.resolve();

    return dispatch(computeFilters(responses, aggregation));
  };
}

export function computeFiltersByAggregation(responses) {
  return (dispatch) => {
    const aggregations = Array.from(
      reduce(
        responses,
        (output, response) => new Set([...output, ...keys(response.aggregations)]),
        new Set()
      )
    );
    return Promise.all(
      map(
        aggregations,
        (aggregation) => dispatch(computeFiltersIfNeeded(responses, aggregation))
      )
    );
  };
}
