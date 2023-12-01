import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../Redux/actions';
import * as Selectors from '../../Redux/selectors';

function Dropdown(props) {
  const {
    selectedApplication,
    applications,
    fetchFromStartToEndAction,
    fetchHistogramData,
    fetchFacetsWithSearchTextAndFilter,
    setSelectedApplication,
  } = props;

  const handleChange = (value) => {
    setSelectedApplication(value);
    fetchFromStartToEndAction();
    fetchHistogramData();
    fetchFacetsWithSearchTextAndFilter();
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {selectedApplication}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {applications.map((item) => (
          <div className="dropdown-item" onClick={() => handleChange(item)} key={item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    applications: Selectors.selectAllApplications(state),
    selectedApplication: Selectors.selectSelectedApplication(state),
  };
};

const mapDispatchToProps = {
  setSelectedApplication: Actions.setSelectedApplication,
  fetchFromStartToEndAction: Actions.fetchFromStartToEndAction,
  fetchHistogramData: Actions.fetchHistogramData,
  fetchFacetsWithSearchTextAndFilter: Actions.fetchFacetsWithSearchTextAndFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
