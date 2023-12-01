import { Container } from '@material-ui/core';
import React from 'react';
import DashboardCard from '../Components/Dashboard/DashboardCard';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Histogram from '../Components/Histogram/Histogram';

export default function DashboardScreen() {
  return (
    <div className="py-3 w-100 h-100">
      <Container>
        <Row>
          <Col>
            <DashboardCard>
              <Histogram />
            </DashboardCard>
          </Col>
        </Row>
        <Row>
          <Col>
            <DashboardCard>Hier könnte Ihre Werbung Stehen</DashboardCard>
          </Col>
          <Col>
            <DashboardCard>Hier auch</DashboardCard>
          </Col>
        </Row>{' '}
        <Row>
          <Col>
            <DashboardCard>Hier nicht.</DashboardCard>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
