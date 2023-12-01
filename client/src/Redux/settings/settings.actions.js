import { REQ_USER_SETTINGS, REQ_SAVE_OR_UPDATE_VIEWS, REQ_DELETE_SETTING, REQ_RESET_GUI } from '../../utils/requestTypes';
import { selectActiveFields, selectActiveNavigators } from '../fields/fields.selectors';
import { selectEndTime, selectStartTime } from '../time/time.selectors';
import { requestSettingsById, requestUserSettings, requestSaveDocument, requestDeleteSetting } from './settings.helper';
import moment from 'moment';
import { requestEndAction, requestStartAction } from '../actions';
import { selectSearchText } from '../selectors';
import { setSearchText } from '../actions';
import Constants from '../../utils/Constants';
import { selectNumPagesForViews, selectNumViews } from '../selectors';
import { setActiveFields, setActiveNavigators } from '../actions';
import {
  changeEndTime,
  changeIntermediateEndTime,
  changeIntermediateStartTime,
  changeStartTime,
  changeTime,
} from '../actions';
import { getInitialTimeState } from '../time/time.reducer';
import { fetchFromStartToEndAction } from '../actions';
import { fetchHistogramData } from '../actions';
import { fetchFacetsWithSearchTextAndFilter } from '../actions';
import { selectFilterFacetData } from '../selectors';
import { setFacetFilter, setSelectedFacetData } from '../actions';
import {setSelectedApplication} from '../actions';
import {toggleMarkedRows, setShowMarkedOnly, setSortUp} from '../actions';
import { getListOfTruthyProps } from '../../utils/getListOfTruthyProps';
import { selectListMarkedRows } from '../selectors';
import {setLiveView, setLiveViewPaused} from '../actions';
import {updateLastRequestType} from '../list/list.actions';
import {} from '../../Components/ResultList/ResultList';
import { SET_NUM_PAGES_FOR_VIEWS, SET_NUM_VIEWS, SET_VIEWS } from './settings.actionTypes';

export const setViews = (payload) => {
  return {
    type: SET_VIEWS,
    payload,
  };
};

export const setNumViews = (payload) => {
  return {
    type: SET_NUM_VIEWS,
    payload,
  };
};

export const setNumPagesForViews = (payload) => {
  return {
    type: SET_NUM_PAGES_FOR_VIEWS,
    payload,
  };
};

/**
 * returns a promise (has to be resolved)
 * save/update user setting in the solr core = usersettings
 * @param {*} name name of the user settings (Ansichtsname in UI), should not be empty
 * @param {*} description description of the user setting, may be empty
 * @param {*} savetime timestamp
 * @param {*} onSuccess on request success handler
 */
export function saveViewsAction(name, description, savetime, onSuccess) {
  return async (dispatch, getState) => {
    const state = getState();

    let technicalData = {
      activeNavigators: selectActiveNavigators(state),
      activeFields: selectActiveFields(state),
      filterSelected: selectFilterFacetData(state),
      searchText: selectSearchText(state),
    };

    if (savetime) {
      technicalData.startTime = moment(selectStartTime(state)).toISOString();
      technicalData.endTime = moment(selectEndTime(state)).toISOString();
    }

    let document = {
      id: name,
      creationtime: moment(),
      description: description,
      settings: JSON.stringify(technicalData),
    };

    dispatch(requestStartAction(REQ_SAVE_OR_UPDATE_VIEWS));
    try {
      await requestSaveDocument(document);
      onSuccess();
    } catch (error) {
      console.error(error);
    }
    dispatch(requestEndAction(REQ_SAVE_OR_UPDATE_VIEWS));
  };
}

/**
 * get user settings by id
 * @param {*} id user setting's id
 * @returns Promise
 */
export function fetchSettingsById(id) {
  return async (dispatch) => {
    try {
      const data = await requestSettingsById(id);
      if (data.hasOwnProperty('error') || data === undefined) {
        dispatch(setViews([]));
        dispatch(setNumViews(0));
        dispatch(setNumPagesForViews(-1));
      } else {
        let arr = [data.log];
        dispatch(setViews(arr));
      }
    } catch (error) {
      console.error(error);
    }
    dispatch(requestEndAction(REQ_USER_SETTINGS));
  };
}
/** pc.state.numPagesForViews: -1 indicates error
 * fetch only user settings that will be displayd in a certain page, take search text into account
 * @param {*} p_number page number (since result should be paginated)
 */
export function fetchCurrentSettings(p_number = 0, text = '') {
  return async (dispatch) => {
    var start = p_number * Constants.VIEWS_PER_PAGE;
    var rows = Constants.VIEWS_PER_PAGE;

    dispatch(requestStartAction(REQ_USER_SETTINGS));
    try {
      const originalData = await requestUserSettings(start, rows, text);
      const data = JSON.parse(originalData);
      if (data.hasOwnProperty('error') || data['docs'].length === 0) {
        dispatch(setViews([]));
        dispatch(setNumViews(0));
        dispatch(setNumPagesForViews(-1));
      } else {
        dispatch(setViews(data['docs']));
        dispatch(setNumViews(data['totalResponseCount']));
        dispatch(setNumPagesForViews(Math.ceil(data['totalResponseCount'] / Constants.VIEWS_PER_PAGE)));
      }
    } catch (error) {
      console.error(error);
    }
    dispatch(requestEndAction(REQ_USER_SETTINGS));
  };
}

/**
 * delete user setting with id = id
 * @param {*} id user setting's id
 */
export function deleteSetting(id, p_number) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(requestStartAction(REQ_DELETE_SETTING));
    try {
      await requestDeleteSetting(id);
      var new_p_number = p_number;
      if (Math.ceil((selectNumViews(state) - 1) / Constants.VIEWS_PER_PAGE) < selectNumPagesForViews(state)) {
        new_p_number = p_number - 1;
      }
      dispatch(fetchCurrentSettings(new_p_number));
    } catch (error) {
      console.error(error);
    }
    dispatch(requestEndAction(REQ_DELETE_SETTING));
  };
}

/**
 * apply user settings
 * @param {*} onlySettingsObject usersettings
 */
export function applySettings(onlySettingsObject) {
  return (dispatch) => {
    var obj = JSON.parse(onlySettingsObject);

    dispatch(setActiveNavigators(obj.activeNavigators));
    dispatch(setActiveFields(obj.activeFields));
    dispatch(setFacetFilter(obj.filterSelected));
    dispatch(setSearchText(obj.searchText));
    dispatch(setSelectedFacetData({}));

    if (obj.hasOwnProperty('startTime')) {
      dispatch(changeStartTime(moment(obj.startTime)));
      dispatch(changeEndTime(moment(obj.endTime)));
      dispatch(changeIntermediateStartTime(moment(obj.startTime)));
      dispatch(changeIntermediateEndTime(moment(obj.endTime)));
    }

    dispatch(fetchFromStartToEndAction());
    dispatch(fetchHistogramData());
    dispatch(fetchFacetsWithSearchTextAndFilter());
  };
}

/**
 * set user settings to default
 */
export function setToDefaultSetting() {
  return (dispatch, getState) => {
    dispatch(updateLastRequestType(REQ_RESET_GUI));
    dispatch(setActiveNavigators(['level', 'component']));
    dispatch(setActiveFields(['time', 'level', 'logFileName', 'message']));
    dispatch(setFacetFilter({}));
    dispatch(setSelectedFacetData({}));
    dispatch(setSearchText(''));
    dispatch(setSelectedApplication('Alle Systeme'));
    dispatch(toggleMarkedRows(getListOfTruthyProps(selectListMarkedRows(getState()))));
    dispatch(setShowMarkedOnly(false));
    dispatch(setSortUp(true));
    dispatch(setLiveView(false));
    dispatch(setLiveViewPaused(false));

    const initialTimeState = getInitialTimeState();
    dispatch(changeTime(initialTimeState));
  };
}
