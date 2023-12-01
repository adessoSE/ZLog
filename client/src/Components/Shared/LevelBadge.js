import React from 'react';
import { Badge } from 'reactstrap';

const colorConfig = {
  INFO: 'info',
  DEBUG: 'success',
  WARN: 'warning',
  ERROR: 'danger',
};

export default function LevelBadge({ level }) {
  return (
    <Badge color={colorConfig[level]} style={{ whiteSpace: 'nowrap' }}>
      {level}
    </Badge>
  );
}
