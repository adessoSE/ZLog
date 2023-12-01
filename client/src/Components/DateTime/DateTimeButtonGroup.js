import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

export default function DateTimeButtonGroup({ resetTime, disabled }) {
  return (
    <ButtonGroup size={'sm'}>
      <Button
        key={1}
        color="light"
        onClick={() => resetTime({ val: -1, unit: 'days' }, { val: 0, unit: 'hours' }, true)}
        title="Show last 24 hours"
        disabled={disabled}
      >
        last 24h
      </Button>
      <Button
        key={2}
        color="light"
        onClick={() => resetTime({ val: -3, unit: 'days' }, { val: 1, unit: 'days' }, true)}
        title="Show last 3 days"
        disabled={disabled}
      >
        last 3d
      </Button>
      <Button
        key={3}
        color="light"
        onClick={() => resetTime({ val: -5, unit: 'minutes' }, { val: 5, unit: 'minutes' }, false)}
        title="Enhance selected time by 5 minutes"
        disabled={disabled}
      >
        ± 5m
      </Button>
      <Button
        key={4}
        color="light"
        onClick={() => resetTime({ val: -30, unit: 'minutes' }, { val: 30, unit: 'minutes' }, false)}
        title="Enhance selected time by 30 minutes"
        disabled={disabled}
      >
        ± 30m
      </Button>
      <Button
        key={5}
        color="light"
        onClick={() => resetTime({ val: -1, unit: 'hours' }, { val: 1, unit: 'hours' }, false)}
        title="Enhance selected time by 1 hour"
        disabled={disabled}
      >
        ± 1h
      </Button>
      <Button
        key={6}
        color="light"
        onClick={() => resetTime({ val: -24, unit: 'hours' }, { val: 24, unit: 'hours' }, false)}
        title="Enhance selected time by 24 hours"
        disabled={disabled}
      >
        ± 24h
      </Button>
    </ButtonGroup>
  );
}
