import { connect } from 'react-redux';

import React, { useEffect, useState } from 'react';
import { Card, Form, FormGroup, Button } from 'reactstrap';
import Logo from '../Components/NavigationDrawer/Logo';
import { sendLoginRequest, logout } from '../Redux/auth/auth.actions';
import { selectIsSessionExpired, selectToken } from '../Redux/auth/auth.selectors';
import { Redirect } from 'react-router-dom';
import { LoggingRoute } from './LoggingRouter';
import { toast } from 'react-toastify';
import $ from 'jquery';

function LoginScreen(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { sendLoginRequest, token, isExpired, logout } = props;

  const isAuthenticated = token != null && !isExpired;

  const login = () => {
    sendLoginRequest(username, password);
  };

  useEffect(() => {
    //TODO login gets called on load to skip LoginScreen
    login();

    if (token && isExpired) {
      toast.warn('Your session is expired. Please login again');
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpired]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      login();
    }
  };

  if (isAuthenticated) {
    $.ajaxSetup({
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token.token);
      },
    });
    return <Redirect to={LoggingRoute.LOGGING} />;
  }

  return (
    <div className="justify-content-center align-items-center d-flex vh-100 wh-100 bg-light">
      <div className="d-flex flex-column">
        <Card className="p-3 shadow-lg bg-white">
          <Logo />
          <Form className="mt-3 border-top p-3">
            <FormGroup>
              Username
              <input
                className="form-control mt-1"
                size="40"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onKeyDown={onKeyDown}
              />
            </FormGroup>
            <FormGroup>
              Password
              <input
                className="form-control mt-1"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </FormGroup>
            <Button className="w-100 mt-3" onClick={login}>
              Login
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: selectToken(state),
    isExpired: selectIsSessionExpired(state),
  };
};

const mapDispatchToProps = {
  sendLoginRequest: sendLoginRequest,
  logout: logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
