import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import DateTime from '../Components/DateTime/DateTime';
import FacetDomain from '../Components/FacetDomain/FacetDomain';
import FilterArea from '../Components/FacetDomain/FilterArea';
import LiveViewFetcher from '../Components/ResultList/LiveViewFetcher';
import config from '../config.json';
import { selectLiveViewActive, selectTimeSlice, selectEndTime} from '../Redux/selectors';
import Constants from '../utils/Constants';
import Header from '../Components/Header/Header';
import ResultList from '../Components/ResultList/ResultListContainer';
import {security_env} from "../utils/Constants_env";

import {
  checkOAuthAuthorizationState2,
  fetchAllApplicationsAction,
  fetchFromStartToEndAction,
  fetchHistogramData,
  fetchFacetsWithSearchTextAndFilter,
  fieldsRequestAction,
  setAllFields,
  setAllNavigators,
  setFacetData,
  setSelectedFacetData,
  fetchSettingsById,
  changeEndTime,
} from '../Redux/actions';
import Histogram from '../Components/Histogram/Histogram';
import { useParams } from 'react-router-dom';
import { selectViews } from '../Redux/selectors';
import { applySettings } from '../Redux/actions';

window.config = config;

function LoggingScreen(props) {
  const {
    checkOAuthAuthorizationState2,
    fetchAllSchemaFields,
    fetchHistogramData,
    fetchFacetsWithSearchTextAndFilter,
    fetchFromStartToEndAction,
    fetchAllApplications,
    setSelectedFacetData,
    time,
    fetchSettingsById,
    isLiveViewActive,
    views,
    applySettings,
    changeEndTime,
  } = props;

  const id = useParams().id;
  const mounted = useRef();

  const isDeadlineReached = () => {
    if (
      !Constants.C1 ||
      !Constants.C2 ||
      !Constants.C3 ||
      Constants.C1 === '' ||
      Constants.C2 === '' ||
      Constants.C3 === ''
    ) {
      return;
    }

    let deadline = moment()
      .year(Constants.C1)
      .month(Constants.C2 - 1)
      .date(Constants.C3);
    return moment().isAfter(deadline, 'day');
  };

  // componentDidMount
  useEffect(() => {
    if (security_env === true) {
      checkOAuthAuthorizationState2();
    }

    if (!mounted.current) {
      // do componentDidMount logic
      fetchAllSchemaFields(() => {
        fetchFromStartToEndAction();
        fetchHistogramData();
        fetchFacetsWithSearchTextAndFilter();
      });
      fetchAllApplications();
      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      setSelectedFacetData({}); // clear selection
      fetchFromStartToEndAction();
      fetchHistogramData();
      fetchFacetsWithSearchTextAndFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useEffect(() => {
    if (isLiveViewActive) {
      changeEndTime(moment().add(1, 'days').valueOf());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLiveViewActive]);
  
  useEffect(() => {
    if (id !== undefined && views.length === 0) {
      fetchSettingsById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined && views.length === 1) {
      let item = views[0];
      if (item !== undefined) {
        let settings = item.settings;
        applySettings(settings);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views]);

  const renderDeadlineOver = () => {
    return (
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div>
            <h2>
              Testzeitraum abgelaufen
              <br />
            </h2>
            <h4>Bitte wenden Sie sich an adesso SE</h4>
          </div>
        </div>
      </div>
    );
  };

  return isDeadlineReached() ? (
    renderDeadlineOver()
  ) : (
    <>
      {isLiveViewActive && <LiveViewFetcher />}
      <Header viewName={id} />
      <div className={'layout-body'}>
        <div className={'layout-body-sidebar'}>
          <div className={'p-2'}>
            <DateTime />
          </div>
          <div className={'filter-area'}>
            <FilterArea />
          </div>
          <div className={'flex-1 overflow-auto px-3 py-1 mb-4'}>
            <FacetDomain />
          </div>
        </div>
        <div className={'layout-body-content pl-3 py-1 mb-4'}>
          <Histogram title={'#logs'} color={Constants.primaryColor} secondColor={Constants.secondaryColor} />
          <ResultList />
        </div>
      </div>
      <div className={'footer bg-dark py-1 px-3 text-white text-right'}>ZLOG - Central Logging | 2023 @ adesso SE</div>
      </>
  );
}

const mapStateToProps = (state) => ({
  isLiveViewActive: selectLiveViewActive(state),
  views: selectViews(state),
  time: selectTimeSlice(state),
  endTime: selectEndTime(state),
});

const mapDispatchToProps = {
  applySettings: applySettings,
  changeFacetData: setFacetData,
  fetchAllSchemaFields: fieldsRequestAction,
  setAllFields: setAllFields,
  setAllNavigators: setAllNavigators,
  fetchHistogramData: fetchHistogramData,
  fetchFromStartToEndAction: fetchFromStartToEndAction,
  fetchFacetsWithSearchTextAndFilter: fetchFacetsWithSearchTextAndFilter,
  fetchAllApplications: fetchAllApplicationsAction,
  setSelectedFacetData: setSelectedFacetData,
  fetchSettingsById: fetchSettingsById,
  changeEndTime: changeEndTime,
  checkOAuthAuthorizationState2: checkOAuthAuthorizationState2,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoggingScreen);
