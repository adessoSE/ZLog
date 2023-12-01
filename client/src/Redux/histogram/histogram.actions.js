import { fetchTimeFacet } from '../../API/histograma.api';
import { prepareDataForHistogram } from './histogram.helper';
import { requestEndAction, requestStartAction, setTotalFound } from '../actions';
import { REQ_HISTOGRAM_DATA, REQ_HISTOGRAM_DATA_FILTERED } from '../../utils/requestTypes';
import { errorHandler } from '../../utils/errorHandler';
import { promisifyXhr } from '../../utils/promisifyXhr';
import { UPDATE_HISTOGRAM_DATA, SET_HISTOGRAM_TYPE } from './histogram.actionTypes';
import { selectIsAnyFilterActive } from '../facet/facet.selectors';

export function updateHistogramData(payload) {
  return {
    type: UPDATE_HISTOGRAM_DATA,
    payload,
  };
}

export function changeHistogramType(payload) {
  return {
    type: SET_HISTOGRAM_TYPE,
    payload,
  };
}



export function fetchHistogramData() {
  return async function (dispatch, getState) {
    const state = getState();
    const isAnyFilterActive = selectIsAnyFilterActive(state);
    try {
      let histogramData = [];

      const xhrWithoutFilters = fetchTimeFacet(state, false);
      dispatch(requestStartAction(REQ_HISTOGRAM_DATA, xhrWithoutFilters));
      const responseWithoutFilters = await promisifyXhr(xhrWithoutFilters);

      histogramData.push(prepareDataForHistogram(JSON.parse(responseWithoutFilters)));

      if (isAnyFilterActive) {
        const xhr = fetchTimeFacet(state, true);
        dispatch(requestStartAction(REQ_HISTOGRAM_DATA_FILTERED, xhr));
        const responseWithFilters = await promisifyXhr(xhr);
        dispatch(setTotalFound(JSON.parse(responseWithFilters)['totalResponseCount']));
        histogramData.unshift(prepareDataForHistogram(JSON.parse(responseWithFilters)));
      } else {
        dispatch(setTotalFound(JSON.parse(responseWithoutFilters)['totalResponseCount']));
      }

      dispatch(updateHistogramData(histogramData));
    } catch (error) {
      errorHandler(error);
    }
    isAnyFilterActive && dispatch(requestEndAction(REQ_HISTOGRAM_DATA_FILTERED));
    dispatch(requestEndAction(REQ_HISTOGRAM_DATA));
  };
}
