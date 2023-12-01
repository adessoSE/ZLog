import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export default function PrivateRoute(props) {
  const { children, fallbackPath, isAuthed, location, ...otherProps } = props;

  return (
    <Route
      {...otherProps}
      render={() => {
        return isAuthed ? children : <Redirect to={{ pathname: fallbackPath, state: { from: location } }} />;
      }}
    />
  );
}
