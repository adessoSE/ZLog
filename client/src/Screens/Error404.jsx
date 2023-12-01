import { Card, Button } from 'reactstrap';
import React from 'react';
import { Link } from 'react-router-dom';
import { LoggingRoute } from './LoggingRouter';

export default function Error404() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100 bg-light">
      <Card className="shadow rounded border-0 p-3 d-flex flex-column">
        <span style={{ fontSize: 80, textShadow: 'grey 0.02em 0.02em 0.15em', fontFamily: 'monospace' }}>404</span>
        <span className="h4">Sorry, there is no page matching this URL.</span>
        <Link to={LoggingRoute.LOGGING}>
          <Button>
            <span className="h4">Back to logging</span>
          </Button>
        </Link>
      </Card>
    </div>
  );
}
