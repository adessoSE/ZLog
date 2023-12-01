import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import LoggingScreen from '../Screens/LoggingScreen';
import DashboardScreen from './DashboardScreen';
import NavigationDrawer from '../Components/NavigationDrawer/NavigationDrawer';
import LoginScreen from './LoginScreen';
import { connect } from 'react-redux';
import { selectIsSessionExpired, selectToken } from '../Redux/auth/auth.selectors';
import $ from 'jquery';


function LoggingRouter(props) {

  const { token, isExpired } = props;

  const isAuthenticated = token != null && !isExpired;
  
  if (isAuthenticated) {
    $.ajaxSetup({
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token.token);
      },
    });
  }

  return (
    <Router>
      <Switch>
        <Route path={LoggingRoute.LOGIN}>
          <LoginScreen />
        </Route>
        {isAuthenticated ? (
          <NavigationDrawer>
            <Route exact isAuthed={isAuthenticated} fallbackPath={LoggingRoute.LOGIN} path={LoggingRoute.DASHBOARD}>
              <DashboardScreen />
            </Route>
            <Route exact isAuthed={isAuthenticated} fallbackPath={LoggingRoute.LOGIN} path={LoggingRoute.LOGGING}>
              <LoggingScreen {...props} />
            </Route>
            <Route exact isAuthed={isAuthenticated} fallbackPath={LoggingRoute.LOGIN} path={LoggingRoute.DEFAULT}>
              <Redirect to={LoggingRoute.LOGGING} />
            </Route>
            <Route exact isAuthed={isAuthenticated} fallbackPath={LoggingRoute.LOGIN} path={LoggingRoute.VIEW}>
              <LoggingScreen {...props} />
            </Route>
            {/*
              <Route exact path="*">
                <Error404 />
              </Route>
            */}
          </NavigationDrawer>
        ) : (
          <Redirect to={LoggingRoute.LOGIN} />
        )}
      </Switch>
    </Router>
  );
}

const LoggingRoute = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LOGGING: '/logging',
  DEFAULT: '/',
  VIEW: '/logging/view/:id',
};

export { LoggingRoute };

const mapStateToProps = (state) => {
  return {
    token: selectToken(state),
    isExpired: selectIsSessionExpired(state),
  };
};

export default connect(mapStateToProps)(LoggingRouter);
