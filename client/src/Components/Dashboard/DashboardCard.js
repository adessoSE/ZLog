import { Card } from 'reactstrap';
import React from 'react';

export default function DashboardCard(props) {
  return <Card className="shadow p-3 mb-5 bg-white rounded w-100 ml-1">{props.children}</Card>;
}
