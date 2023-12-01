import React, { useState } from 'react';
import FacetSubType from './FacetSubType';
import { Input } from 'reactstrap';
import Toolbar from './Toolbar';

export default function FacetType(props) {
  const { type, facets, facetSelected, fetchAdditionalFacetsByType, fetchFacetsByTypeAndSearchStringAction } = props;

  const [searchString, setSearchString] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const toggleSearchInput = () => {
    if (showSearchInput) {
      setSearchString('');
      setShowSearchInput(false);
    } else {
      setShowSearchInput(true);
    }
  };

  const fetchAdditionalFacets = () => {
    fetchAdditionalFacetsByType(type);
  };

  const handleSearchStringChange = (event) => {
    setSearchString(event.target.value);

    // debounced action
    fetchFacetsByTypeAndSearchStringAction(type, searchString);
  };

  const searchResult = (facet) => {
    return (
      !searchString ||
      !!facetSelected[facet.id] ||
      facet.subtype.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())
    );
  };

  return (
    <div>
      <div className="navigator-header">
        <div className="data" style={{ fontWeight: 'bold', paddingLeft: '0px' }}>
          {type.toUpperCase()}
        </div>
        <div className="iconArea">
          <Toolbar
            buttons={[
              {
                onClick: fetchAdditionalFacets,
                title: 'Show more value',
                content: <i className="fa fa-plus-square" />,
              },
              {
                onClick: toggleSearchInput,
                title: 'Filter values',
                content: <i className="fa fa-filter" />,
              },
            ]}
          />
        </div>
      </div>
      {showSearchInput && (
        <Input
          type="text"
          className="form-control search-field"
          placeholder="Search"
          value={searchString}
          onChange={handleSearchStringChange}
        />
      )}
      <div className="navigator-values">
        {facets ? (
          facets.filter(searchResult).map((facet) => {
            return <FacetSubType key={facet.id} facet={facet} searchString={searchString} />;
          })
        ) : (
          <div className="alert alert-info mr-3" role="alert">
            No entries
          </div>
        )}
      </div>
    </div>
  );
}
