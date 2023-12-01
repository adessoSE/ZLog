import React, { Component } from 'react';

import SettingsArea from '../SettingsArea/SettingsArea';
import Dropdown from './Dropdown';
import SearchBar from './SearchBar';

import '../../SCSS/Header.scss';

class Header extends Component {
  render() {
    return (
      <nav className={'navbar navbar-dark bg-dark flex-md-nowrap p-2'}>
        {/*<p className="col-sm-3 col-md-2 mr-0 p-3 mb-2 text-white">Central Logging</p>*/}
        <SearchBar />
        <div className={'px-2'}>
          <Dropdown />
        </div>

        <SettingsArea viewName={this.props.viewName} toggleVisibility={this.props.toggleVisibility} />
      </nav>
    );
  }
}

export default Header;
