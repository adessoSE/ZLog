import { Collapse } from 'reactstrap';
import React, { useState } from 'react';
import Icon from '../Shared/Icon';
import LightButton from '../Shared/LightButton';
import '../../SCSS/MainBody.scss';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { setIsDrawerOpen } from '../../Redux/actions';

function SideDrawerMenu(props) {
  const { title, icon, children, path, setIsDrawerOpen } = props;

  const [isSubMenuOpen, setIsSubmenuOpen] = useState(false);

  const renderSubMenus = () => {
    return (
      <Collapse isOpen={isSubMenuOpen} className="drawer-sub-menu">
        {children}
      </Collapse>
    );
  };

  const toggleSubMenu = (e) => {
    e.preventDefault();
    setIsSubmenuOpen(!isSubMenuOpen);
  };

  const renderArrow = () => {
    return (
      <div className="d-flex justify-content-center flex-column">
        <LightButton onClick={toggleSubMenu}>
          <Icon type="caret-up" style={{ transform: `rotate(${isSubMenuOpen ? 180 : 270}deg)` }} />
        </LightButton>
      </div>
    );
  };

  return (
    <>
      <div className="bg-light w-100" style={{ height: 1 }} />
      <div className="d-flex align-children-center drawer-menu">
        <NavLink
          to={path}
          className="flex-grow-1 d-flex info"
          onClick={() => setIsDrawerOpen(false)}
          activeClassName="active"
        >
          <span className="px-2 pl-4">
            <Icon type={icon} />
          </span>
          <span className="flex-grow-1 px-2">{title}</span>
        </NavLink>
        {children && renderArrow()}
      </div>

      {children && renderSubMenus()}
    </>
  );
}
const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {
  setIsDrawerOpen: setIsDrawerOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawerMenu);
