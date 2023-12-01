import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

export default function Toolbar(props) {
  const { size = 'sm', buttons = [] } = props;

  const buttonList = buttons.map((button) => {
    const { title, content, onClick, color = 'light' } = button;
    return (
      <Button onClick={onClick} title={title} key={title} color={color}>
        {content}
      </Button>
    );
  });

  return <ButtonGroup size={size}>{buttonList}</ButtonGroup>;
}
