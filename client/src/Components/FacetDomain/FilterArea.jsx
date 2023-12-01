import React from 'react';
import 'font-awesome/css/font-awesome.css';
import 'react-datepicker/src/stylesheets/datepicker.scss';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import {
  selectIsFacetTypeNegated,
  selectFilterFacetData,
  selectFilterFacetDataGroupedByType,
  selectNegatedFilterTypes,
  selectTotalFound,
  selectLastRequestType,
} from '../../Redux/selectors';
import {
  mergeFacetFilter,
  mergeNegatedFilterType,
  setSelectedFacetData,
  fetchFromStartToEndAction,
  fetchHistogramData,
  fetchFacetsWithSearchTextAndFilter,
} from '../../Redux/actions';

import isEqual from 'lodash/isEqual';
import { REQ_RESET_GUI } from '../../utils/requestTypes';
import FormatNumber from '../Shared/FormatNumber';

class FilterArea extends React.Component {
  componentDidUpdate(prevProps) {
    // if filter or negation changed => fetch
    if (
      (!isEqual(prevProps.originalFacetFilters, this.props.originalFacetFilters) ||
        !isEqual(prevProps.originalFacetFiltersNegated, this.props.originalFacetFiltersNegated)) &&
      this.props.lastRequestType !== REQ_RESET_GUI
    ) {
      this.props.setSelectedFacetData({});
      this.props.fetchFromStartToEndAction();
      this.props.fetchHistogramData();
      this.props.fetchFacetsWithSearchTextAndFilter();
    }
  }

  getFilterData() {
    var keys = Object.keys(this.props.filterSelected);
    //console.log(keys);
    return keys
      .filter((key) => this.props.filterSelected[key].values.length !== 0)
      .map((key, idx) => {
        // if (this.props.filterSelected[key].values.length !== 0) {
        return (
          <React.Fragment key={key + idx}>
            <div className={'navigator-header'}>
              <div className="data" style={{ fontWeight: 'bold', paddingLeft: '0px' }}>
                {key.toUpperCase()}
              </div>
              <Button
                size={'sm'}
                color={'secondary'}
                outline
                title="Toggle Negated"
                onClick={() => {
                  this.props.negateFilterType({
                    [key]: !this.props.isFacetTypeNegated(key),
                  });
                }}
              >
                {this.props.isFacetTypeNegated(key) ? 'Filter negated' : 'Filter affirmative'}
              </Button>
            </div>
            <div className="navigator-values">
              {this.props.filterSelected[key].values
                .filter((subtype) => subtype !== 'negated')
                .map((subtype) => {
                  //if (subtype !== "negated") {
                  return (
                    <div className="container-data navigator-value" key={subtype}>
                      <div className="navigator-value-content" title={subtype} id={subtype}>
                        {' '}
                        {subtype}
                      </div>
                      <div
                        className="fa fa-remove iconArea"
                        data-toggle="tooltip"
                        title="Remove filter"
                        onClick={() => this.handleRemove(key, subtype)}
                      />
                    </div>
                  );
                  //  }
                })}
            </div>
          </React.Fragment>
        );
        //            }
      });
  }

  handleRemove(key, subtype) {
    const filterId = key + ':' + subtype;
    this.props.updateFilter({ [filterId]: false });
  }
  render() {
    return (
      <>
        <div className={'filter-area-total-count'}>
          <span>Total count: </span>
          <FormatNumber number={this.props.numFound} style={{ fontWeight: 600 }} />
        </div>
        {Object.keys(this.props.filterSelected).length !== 0 && (
          <div className="filterArea-tableFixHead filter-area-facets"> {this.getFilterData()} </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    numFound: selectTotalFound(state),
    filterSelected: selectFilterFacetDataGroupedByType(state),
    isFacetTypeNegated: (type) => selectIsFacetTypeNegated(state, type),
    originalFacetFilters: selectFilterFacetData(state),
    originalFacetFiltersNegated: selectNegatedFilterTypes(state),
    lastRequestType: selectLastRequestType(state),
  };
};

const mapDispatchToProps = {
  negateFilterType: mergeNegatedFilterType,
  updateFilter: mergeFacetFilter,
  fetchFromStartToEndAction: fetchFromStartToEndAction,
  fetchHistogramData: fetchHistogramData,
  fetchFacetsWithSearchTextAndFilter: fetchFacetsWithSearchTextAndFilter,
  setSelectedFacetData: setSelectedFacetData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterArea);
