import React from 'react';
import '../../SCSS/DetailView.scss';
import Octicon, { Plus, Pencil, Check, X, Trashcan } from '@primer/octicons-react';
//import { Button } from 'reactstrap';

/**
 * Renders a <Button /> component.
 * @param {object} props - the components props
 * @param {string} props.type - the type of button
 * @param {string} props.title - the button's title
 * @param {string} props.text - the button's text
 * @param {function} props.handleOnClick - the function triggered by the button's onClick
 * @param {string} props.additionalClasses - any additional classes the button should have
 * @param {boolean} props.isDisabled - the buttons disabled state (true => button is set to disabled)
 */
function DetailViewButton(props) {
  const { type, title, text, handleOnClick, additionalClasses, isDisabled } = props;

  /* const style = {
     width: 40
   }*/

  /**
   * Returns matching classes for given button type.
   * @param {string} type - the button type
   * @returns {string} classes matching given type
   */
  const switchTypeClasses = (type) => {
    switch (type) {
      case 'add':
        return 'btn-secondary';
      case 'edit':
        return 'btn-secondary';
      case 'cancel':
        return 'btn-Button btn-secondary';
      case 'save':
        return 'btn-secondary';
      case 'delete':
        return 'btn-Button btn-secondary';
      default:
        return '';
    }
  };
  /**
   * Returns icon for the given button types
   * @returns {string} links -the link to the button icosn
   * see in DetailView.scss
   */

  const switchIconClasses = (type) => {
    switch (type) {
      case 'add':
        return Plus;
      case 'edit':
        return Pencil;
      case 'cancel':
        return X;
      case 'save':
        return Check;
      case 'delete':
        return Trashcan;
      default:
        return;
    }
  };

  const commonClasses = 'btn fa ml-1 h-100';
  const typeClasses = switchTypeClasses(type);

  // combine different class types
  const classes = [].concat(commonClasses).concat(typeClasses).concat(additionalClasses).join(' ');

  return (
    <button title={title} className={classes} onClick={handleOnClick} disabled={isDisabled}>
      {text} {<Octicon icon={switchIconClasses(type)} />}
    </button>
  );
}

export default DetailViewButton;
