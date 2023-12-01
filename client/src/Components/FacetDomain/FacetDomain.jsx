import React, { useEffect } from 'react';
import '../../SCSS/SideBar.scss';
import { selectActiveNavigators, selectFacetData, selectSelectedFacetData } from '../../Redux/selectors';
import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import FacetType from '../FacetDomain/FacetType';
import {
  debounced_fetchFacetsByTypeAndSearchStringAction,
  fetchAdditionalFacetsByType,
  fetchFromStartToEndAction,
  fetchHistogramData,
} from '../../Redux/actions';
import isEmpty from 'lodash/isEmpty';

function FacetDomain(props) {
  const {
    facetdata,
    facetSelected,
    fetchAdditionalFacetsByType,
    fetchFacetsByTypeAndSearchStringAction,
    fetchFromStartToEndAction,
    fetchHistogramData,
    activeNavigators,
  } = props;
  const groupedFacetData = groupBy(facetdata, 'type');

  useEffect(() => {
    if (isEmpty(facetSelected)) {
      return;
    }
    fetchFromStartToEndAction({ onlyTable: true });
    fetchHistogramData();
  }, [facetSelected, fetchFromStartToEndAction, fetchHistogramData]);

  return (
    <div>
      {activeNavigators.map((type) => {
        const allFacetsPerType = groupedFacetData[type];

        return (
          <FacetType
            key={type}
            type={type}
            facets={allFacetsPerType}
            facetSelected={facetSelected}
            fetchAdditionalFacetsByType={fetchAdditionalFacetsByType}
            fetchFacetsByTypeAndSearchStringAction={fetchFacetsByTypeAndSearchStringAction}
          />
        );
      })}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    facetdata: selectFacetData(state),
    facetSelected: selectSelectedFacetData(state),
    activeNavigators: selectActiveNavigators(state),
  };
};

const mapDispatchToProps = {
  fetchAdditionalFacetsByType: fetchAdditionalFacetsByType,
  fetchFacetsByTypeAndSearchStringAction: debounced_fetchFacetsByTypeAndSearchStringAction,
  fetchFromStartToEndAction: fetchFromStartToEndAction,
  fetchHistogramData: fetchHistogramData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FacetDomain);
