import React, { useState } from 'react';
import SideDrawer from './SideDrawer';
import GlobalHeader from './GlobalHeader';
import { connect } from 'react-redux';
import { selectIsDrawerOpen } from '../../Redux/selectors';

export function NavigationDrawer(props) {
  const { isDrawerOpen } = props;

  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <div className="vw-100 vh-100 d-flex flex-column">
      <GlobalHeader setHeaderHeight={setHeaderHeight} />
      <SideDrawer headerHeight={headerHeight} />
      <div id="navigator-content" className={`flex-grow-1 d-flex flex-column w-100 ${isDrawerOpen ? 'in' : ''}`}>
        {props.children}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isDrawerOpen: selectIsDrawerOpen(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationDrawer);
