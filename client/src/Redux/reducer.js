import { combineReducers } from 'redux';
import { timeReducer } from './time/time.reducer';
import { histogramDataReducer } from './histogram/histogram.reducer';
import { listDataReducer } from './list/list.reducer';
import { searchTextReducer } from './searchText/searchText.reducer';
import { liveViewReducer } from './liveView/liveView.reducer';
import { facetDataReducer } from './facet/facet.reducer';
import { fieldsReducer } from './fields/fields.reducer';
import { activeRequestsReducer } from './activeRequests/activeRequests.reducer';
import { settingsReducer } from './settings/settings.reducer';
import { applicationReducer } from './application/application.reducer';
import { detailViewReducer } from './detailView/detailView.reducer';
import { navigationDrawerReducer } from './navigationDrawer/navigationDrawer.reducer';
import { authReducer } from './auth/auth.reducer';

export const reducer = combineReducers({
  time: timeReducer,
  histogramData: histogramDataReducer,
  list: listDataReducer,
  searchText: searchTextReducer,
  liveView: liveViewReducer,
  facet: facetDataReducer,
  fields: fieldsReducer,
  activeRequests: activeRequestsReducer,
  settings: settingsReducer,
  application: applicationReducer,
  detailView: detailViewReducer,
  navigationDrawer: navigationDrawerReducer,
  auth: authReducer,
});
