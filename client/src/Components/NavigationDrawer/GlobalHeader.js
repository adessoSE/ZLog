import { Button } from 'reactstrap';
import React, { useEffect, useRef } from 'react';
import Icon from '../Shared/Icon';
import Logo from './Logo';
import * as Actions from '../../Redux/actions';
import { connect } from 'react-redux';
import { selectIsDrawerOpen } from '../../Redux/selectors';
import { logout } from '../../Redux/auth/auth.actions';
import { selectUserName, selectUserMail } from '../../Redux/auth/auth.selectors';
import Constants from '../../utils/Constants';

function GlobalHeader(props) {
  const { isDrawerOpen, setIsDrawerOpen, setHeaderHeight, logout, username, mail } = props;
  const ref = useRef();
  const imgsource = Constants.customLogoSource;

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return (
    <div className="w-100 flex-grow-0 d-flex p-2" ref={ref}>
      {process.env.REACT_APP_NO_ADMIN !== 'true' && (
        <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          <Icon type={'bars'} />
        </Button>
      )}
      <div className={'px-4 align-self-center'}>
        <Logo custom={imgsource} height='40px' />
      </div>
      <div className="flex-grow-1" />
      <div className="d-flex flex-column align-items-end mr-2 text-muted">
        <span>{username}</span>
        <span>{mail}</span>
      </div>
      <div>
        <Button onClick={logout} title="logout">
          <Icon type={'sign-out'} />
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isDrawerOpen: selectIsDrawerOpen(state),
    username: selectUserName(state),
    mail: selectUserMail(state),
  };
};

const mapDispatchToProps = {
  setIsDrawerOpen: Actions.setIsDrawerOpen,
  logout: logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalHeader);
