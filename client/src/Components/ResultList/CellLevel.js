import React from 'react';
import LevelBadge from '../Shared/LevelBadge';

export default function CellLevel({ data }) {
  return <LevelBadge level={data.props.value} />;
}
