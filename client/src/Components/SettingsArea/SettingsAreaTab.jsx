import React from 'react';
import { Button, ModalBody, ModalFooter } from 'reactstrap';

/**
 * Sort of abstract class for any settings area tab.
 * Extend this class and override getButtons() and renderBody() to customize your tab
 */
const SettingsAreaTab = (props) => {
  const renderFooter = () => {
    if (!props.buttons) {
      return null;
    }
    props.buttons.push({
      text: 'Cancel',
      callback: props.toggleVisibility,
    });

    return (
      <div className="d-flex justify-content-end mt-2">
        {props.buttons.map((buttonInfo, key) => {
          return (
            <Button key={key} className="btn btn-secondary m-1" style={buttonInfo.style} onClick={buttonInfo.callback}>
              {buttonInfo.text}
            </Button>
          );
        })}
      </div>
    );
  };

  if (props.activeTab === props.tabId) {
    return (
      <>
        <ModalBody className="modal-body-settings">{props.children}</ModalBody>
        <ModalFooter>{renderFooter()}</ModalFooter>
      </>
    );
  } else {
    return null;
  }
};
export default SettingsAreaTab;
