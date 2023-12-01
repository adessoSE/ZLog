import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';
import { mergeFacetFilter, mergeSelectedFacetData, setSelectedFacetData, fetchFromStartToEndAction } from '../../Redux/actions';
import { selectSelectedFacetData, selectTotalFound, selectFilterFacetData } from '../../Redux/selectors';
import pickBy from 'lodash/pickBy';

let doubleClickDelay = 100;

function FacetSubType(props) {
  const { facet, totalFound, setSelection, selectedFacets, mergeFilter, fetchFromStartToEndAction, selectedFilter } = props;
  const { subtype, count, id, type } = facet;

  const isSelected = !!selectedFacets[id];
  let timeoutDoubleClick;
  let preventSingleClick;

  const mergeSelection = (selection) => {
    const sameType = pickBy(selectedFacets, (val, key) => {
      return key.startsWith(type);
    });
    setSelection({ ...sameType, ...selection });
  };

  const handleClick = (event) => {
    event.persist();
    if (id in selectedFacets) {
      doubleClickDelay = 200;
    } else {
      doubleClickDelay = 100;
    }
    timeoutDoubleClick = setTimeout(() => {
      if (!preventSingleClick) {
        if (event.ctrlKey) {
          mergeSelection({ [id]: false });
        } else if (event.shiftKey) {
          mergeSelection({ [id]: true });
        } else {
          setSelection({ [id]: !isSelected });
        }
      }
      preventSingleClick = false;
    }, doubleClickDelay);
    //console.log("singleclick")
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      addToFilter();
    }
  };
  const handleDoubleClick = () => {
    clearTimeout(timeoutDoubleClick);
    preventSingleClick = true;
    if (Object.keys(selectedFacets).length === 0 && !selectedFilter[id]) {
      addToFilterTouch({ [id]: !isSelected });
      //console.log('doubleclick with touchpad');
    } else if (!Object.keys(selectedFacets).every((element) => selectedFilter[element])) {
      addToFilter();
      //console.log('doubleclick');
    } else {
      clearSelection();
      fetchFromStartToEndAction();
    }
  };

  const addToFilter = () => {
    clearSelection();
    mergeFilter(selectedFacets);
  };

  const addToFilterTouch = (input) => {
    clearSelection();
    mergeFilter(input);
  };

  const clearSelection = () => {
    setSelection({});
  };

  return (
    <div
      className={'container-data navigator-value' + (isSelected ? ' active' : '')}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      id={subtype}
    >
      <div className="navigator-value-content" title={subtype}>
        {subtype}
      </div>
      <div className={'navigator-value-count'}>
        <ProgressBar width={(count / totalFound) * 100} label={count} />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  selectedFacets: selectSelectedFacetData(state),
  totalFound: selectTotalFound(state),
  selectedFilter: selectFilterFacetData(state),
});

const mapDispatchToProps = {
  mergeSelection: mergeSelectedFacetData,
  setSelection: setSelectedFacetData,
  mergeFilter: mergeFacetFilter,
  fetchFromStartToEndAction: fetchFromStartToEndAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(FacetSubType);
