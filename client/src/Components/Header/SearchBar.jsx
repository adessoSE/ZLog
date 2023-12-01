import React from 'react';
import {
  setSearchText,
  fetchFromStartToEndAction,
  fetchHistogramData,
  fetchFacetsWithSearchTextAndFilter,
} from '../../Redux/actions';
import { connect } from 'react-redux';

function SearchBar(props) {
  const {
    searchText,
    setSearchText,
    fetchFromStartToEndAction,
    fetchHistogramData,
    fetchFacetsWithSearchTextAndFilter,
  } = props;

  const fetchData = () => {
    fetchFromStartToEndAction();
    fetchHistogramData();
    fetchFacetsWithSearchTextAndFilter();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        onKeyPress={handleKeyPress}
        data-toggle="tooltip"
        title="Search text"
      />
      <div className="input-group-append">
        <button className="btn btn-secondary" type="button" onClick={fetchData} data-toggle="tooltip" title="Search">
          <i className="fa fa-search" />
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    searchText: state.searchText,
  };
};

const mapDispatchToProps = {
  setSearchText: setSearchText,
  fetchFromStartToEndAction: fetchFromStartToEndAction,
  fetchHistogramData: fetchHistogramData,
  fetchFacetsWithSearchTextAndFilter: fetchFacetsWithSearchTextAndFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
