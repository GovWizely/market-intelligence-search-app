import _ from 'lodash';
import assign from 'object-assign';
import axios from 'axios';

import { formatFilterParams, formatParams } from '../utils/action-helper';

export const REQUEST_TRADE_API = 'REQUEST_TRADE_API';
export const RECEIVE_TRADE_API = 'RECEIVE_TRADE_API';
const tradeAPIKey = 'hSLqwdFz1U25N3ZrWpLB-Ld4';

function requestTradeAPI(resource) {
  return {
    type: REQUEST_TRADE_API,
    resource: resource.stateKey
  };
}

function receiveTradeAPI(resource, response) {
  return {
    type : RECEIVE_TRADE_API,
    resource: resource.stateKey,
    response
  };
}

function fetchTradeAPI(resource, params) {
  return (dispatch, getState) => {
    if (getState().results[resource.stateKey].isFetching) return null;
    dispatch(requestTradeAPI(resource));

    return axios.get(`https://api.trade.gov/${resource.apiPath}/search?api_key=${tradeAPIKey}`, { params })
      .then(function(response) {
        const { total, offset, sources_used, results } = response.data;
        let data = {
          metadata: { total, offset, sources_used },
          results
        };
        dispatch(receiveTradeAPI(resource, data));
      });
  };
}

export function fetchTradeEvents(query) {
  const resource = { stateKey: 'tradeEvent', apiPath: 'trade_events' };

  const params = formatParams(query, [
    'q', 'countries', 'industries', 'sources',
    'start_date', 'end_date', 'size', 'offset'
  ]);
  return fetchTradeAPI(resource, params);
}

export function fetchTradeLeads(query) {
  const resource = { stateKey: 'tradeLead', apiPath: 'trade_leads' };
  const params = formatParams(query, [
    'q', 'countries', 'industries', 'sources',
    'start_date', 'end_date', 'size', 'offset'
  ]);
  return fetchTradeAPI(resource, params);
}