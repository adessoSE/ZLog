import React, { useState } from 'react';
import { Form, Card } from 'react-bootstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

import SettingsAreaTab from './SettingsAreaTab';
import Constants from '../../utils/Constants';
import Messages from '../../utils/Messages';

import { toast } from 'react-toastify';
import { getFactorForUnit } from '../../Redux/liveView/liveView.helper';

export default function SettingsAreaTabLiveView(props) {
  const { liveViewFreqRedux, setLiveViewFreqRedux, liveViewUnitRedux, setLiveViewUnitRedux, toggleVisibility } = props;

  const transformUnitInverse = () => {
    const factor = getFactorForUnit(liveViewUnitRedux);
    return liveViewFreqRedux / factor;
  };

  const [liveViewFreq, setLiveViewFreq] = useState(transformUnitInverse());
  const [liveViewUnit, setLiveViewUnit] = useState(liveViewUnitRedux);

  const onLiveViewFreqChanged = (event) => setLiveViewFreq(event.target.value);

  const onLiveViewUnitChanged = (event) => setLiveViewUnit(event.target.value);

  const saveView = () => {
    if (liveViewFreq < Constants.VALUE_FREQ_MIN) {
      toast.error('Value cannot be below ' + this.state.minimumLLV);
      return;
    }

    setLiveViewFreqRedux(liveViewFreq, liveViewUnit);
    setLiveViewUnitRedux(liveViewUnit);
    toggleVisibility();
  };

  /** ####################################### */

  const buttons = [{ text: 'Save', callback: saveView }];

  return (
    <SettingsAreaTab buttons={buttons} {...props}>
      <div>
        <Card>
          <Card.Header>
            Frequency for querying in the light live view: {liveViewFreq} {liveViewUnit}
          </Card.Header>
          <Card.Body>
            <div className="container">
              <div className="row">
                <div className="col">
                  <Form.Label htmlFor="">Update frequency</Form.Label>
                  <AvForm>
                    <AvField
                      errorMessage={Messages.SETTINGSAREATABLIVEVIEW_AVFIELD_ERROR_MESSAGE}
                      name="minPropString"
                      id="TextInputLLV"
                      type="number"
                      min={Constants.MINIMUM_UI}
                      value={liveViewFreq}
                      onChange={onLiveViewFreqChanged}
                    />
                  </AvForm>
                </div>
                <div className="col">
                  <Form.Label htmlFor="">Time unit</Form.Label>
                  <Form.Control value={liveViewUnit} onChange={onLiveViewUnitChanged} as="select" id="SelectLLV">
                    <option>ms</option>
                    <option>sec</option>
                    <option>min</option>
                  </Form.Control>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </SettingsAreaTab>
  );
}
