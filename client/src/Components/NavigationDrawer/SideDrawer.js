import React from 'react';
import { Fade } from '@material-ui/core';
import '../../SCSS/MainBody.scss';
import SideDrawerMenu from './SideDrawerMenu';
import { connect } from 'react-redux';
import { selectIsDrawerOpen } from '../../Redux/selectors';
import { setIsDrawerOpen } from '../../Redux/actions';
import { LoggingRoute } from '../../Screens/LoggingRouter';
import servicesConfig from '../../servicesConfig.json';

function SideDrawer(props) {
  const { isDrawerOpen, setIsDrawerOpen, headerHeight } = props;

  const toggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <div
      className="position-absolute vw-100 d-flex flex-row"
      style={{
        zIndex: 10,
        pointerEvents: isDrawerOpen ? 'all' : 'none',
        marginTop: headerHeight,
        height: `calc(100% - ${headerHeight}px)`,
      }}
    >
      <div
        className={`h-100 sidebar-collapse d-flex flex-column justify-content-between ${isDrawerOpen ? 'in' : ''}`}
        style={{ zIndex: '9999', backgroundColor: 'white' }}
      >
        <div id="navigation-menus" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          <SideDrawerMenu title="Logging" icon="list" path={LoggingRoute.LOGGING} />
          {servicesConfig['DASHBOARD'] ? <SideDrawerMenu title="Dashboard" icon="dashboard" path={LoggingRoute.DASHBOARD} /> : ""}
        </div>
        <div className="footer bg-dark py-1 px-3 text-white text-left">ZLOG - Central Logging | 2020 @ adesso SE</div>
      </div>
      <Fade className="flex-grow-1" in={isDrawerOpen}>
        <div className="h-100 w-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} onClick={toggle}></div>
      </Fade>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isDrawerOpen: selectIsDrawerOpen(state),
  };
};

const mapDispatchToProps = {
  setIsDrawerOpen: setIsDrawerOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
