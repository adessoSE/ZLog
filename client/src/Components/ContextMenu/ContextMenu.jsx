import React, { cloneElement, isValidElement, useContext, useState, useEffect, useRef } from 'react';

const ContextMenuContext = React.createContext();

/**
 * Provides the context menu. Wrap this around your most top element
 * @param {*} param0 Children
 */
function ContextMenuProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [menu, setMenu] = useState(null);

  const ref = useRef();

  useOnClickOutside(ref, () => setVisible(false));

  const openContextMenu = (event, menu) => {
    if (!menu || menu.length === 0 || event.ctrlKey) {
      console.warn('Tried to open context menu without items. Aborting...');
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setVisible(true);
    setPosition({ x: event.clientX, y: event.clientY });
    setMenu(menu);
  };

  const isValidMenuItem = (item) => {
    if (!item) {
      return false;
    }
    if (typeof item !== 'object') {
      return false;
    }
    return (
      item.name &&
      (item.callback || item.subMenu || item.customDom) &&
      (!item.closeOnClick || typeof item.closeOnClick === 'boolean')
    );
  };

  const renderMenu = (menu, id, alignToMouse) => {
    return (
      <ul
        ref={ref}
        id={id}
        className="dropdown-menu"
        style={
          alignToMouse
            ? {
                top: position.y,
                left: position.x,
                visibility: visible ? 'visible' : 'hidden',
              }
            : null
        }
      >
        {menu.map((menuItem, index) => {
          if (!isValidMenuItem(menuItem)) {
            console.error('Not a valid menu item. Skipping...', menuItem);
            return null;
          }

          const onMenuButtonClicked = () => {
            if (menuItem.subMenu) {
              return;
            }

            menuItem.callback();
            if (menuItem.closeOnClick) {
              setVisible(false);
            }
          };

          return (
            <li
              key={index}
              className={
                'dropdown-item' +
                (menuItem.disabled ? ' disabled' : '') +
                (menuItem.subMenu ? ' dropdown-submenu dropdown-toggle' : '')
              }
              onClick={onMenuButtonClicked}
            >
              {menuItem.customDom ? (
                menuItem.customDom
              ) : (
                <>
                  <span className={menuItem.toggled ? 'fa fa-check' : ''}></span>
                  <span>{menuItem.name}</span>{' '}
                </>
              )}
              {menuItem.subMenu && renderMenu(menuItem.subMenu)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <ContextMenuContext.Provider value={openContextMenu}>
      {children}
      {visible && menu && menu.length && renderMenu(menu, 'context-menu', true)}
    </ContextMenuContext.Provider>
  );
}

/**
 * Wrap this Component around another Component which shall have the context-menu
 * Make sure NOT to implement onContextMenu on the child component
 * @param {*} props Properties
 */
function ContextMenu(props) {
  const menu = props.menu;
  if (!menu || !Array.isArray(menu)) {
    throw new Error('ContextMenu needs a menu property which is an array defining menu items');
  }

  const openContextMenu = useContextMenu();
  const children = Array.isArray(props.children) ? props.children : [props.children];
  const childrenWithProps = children.map((child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        onContextMenu: (e) => {
          openContextMenu(e, menu);
        },
        key: index,
      });
    }
    return child;
  });
  return childrenWithProps;
}

/**
 * Hook for using context menu
 */
function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('useContextMenu must be within a ContextMenuProvider.');
  }
  return context;
}

class ContextMenuItem {
  constructor(name, callback, closeOnClick = true) {
    this.name = name;
    this.callback = callback;
    this.closeOnClick = closeOnClick;

    this.disabled = false;
    this.isToggle = false;
    this.subMenu = null;
  }

  setDisabled(disabled = true) {
    this.disabled = disabled;
    return this;
  }

  setIsToggle(isToggle = true) {
    this.isToggle = isToggle;
    return this;
  }

  setToggled(toggled) {
    this.toggled = toggled;
    return this;
  }

  setSubMenu(subMenu) {
    this.subMenu = subMenu;
    return this;
  }

  setCustomDom(dom) {
    this.customDom = dom;
    return this;
  }
}

export { ContextMenuProvider, ContextMenu, ContextMenuItem, useContextMenu };

// Hook
function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}
