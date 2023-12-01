import ReactDOM from 'react-dom';

export function ContextMenuPortal(props) {
  const { children, portalId = 'context-menu-portal' } = props;
  let container = document.getElementById(portalId);
  if (!container) {
    container = document.createElement('div');
    container.id = portalId;
    document.body.appendChild(container);
  }

  return container ? ReactDOM.createPortal(children, container) : null;
}
