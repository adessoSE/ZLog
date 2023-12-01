import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import uniqid from 'uniqid';
import DefaultLoadingOverlay from '../../utils/DefaultLoadingOverlay';
import SettingsAreaTab from './SettingsAreaTab';

class SettingsAreaTabList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightElements: props.activeElements,
      leftElements: this.setDiffElements(props.allElements, props.activeElements),
      highlightedElements: {},
    };
  }

  /**
   * If you open the settings before all elements are loaded, no elements will be shown until you reopen the settings
   * This function displays the elements as soon as they are loaded even without reopening the settings
   * @param {Object} oldProps Props from previous update call
   */
  componentDidUpdate(oldProps) {
    if (
      this.props &&
      oldProps &&
      oldProps.allElements &&
      this.props.allElements &&
      JSON.stringify(oldProps.allElements) !== JSON.stringify(this.props.allElements)
    ) {
      this.setState({
        leftElements: this.setDiffElements(this.props.allElements, this.props.activeElements),
      });
    }
  }

  setDiffElements(univ, subset) {
    return univ.filter((x) => !subset.includes(x));
  }

  handleSingleClick(highlighted, available, item) {
    // If the only selected item was clicked, deselect it
    highlighted.lastIndex = available.indexOf(item);
    if (highlighted.values.length === 1 && highlighted.values[0] === item) {
      highlighted.values = [];
    } else {
      highlighted.values = [item];
    }
  }

  handleShiftClick(highlighted, available, item) {
    var lastIndex = highlighted.lastIndex;
    var currentIndex = available.indexOf(item);

    if (lastIndex == null || !lastIndex || currentIndex === lastIndex) {
      this.handleSingleClick(highlighted, available, item);
      return;
    }

    if (lastIndex > currentIndex) {
      const tmp = lastIndex;
      lastIndex = currentIndex;
      currentIndex = tmp;
    }

    highlighted.values = [];
    for (var i = lastIndex; i <= currentIndex; i++) {
      highlighted.values.push(available[i]);
    }
  }

  handleCtrlClick(highlighted, item) {
    // if you ctrl+click an item, toggle its selection
    if (highlighted.values.includes(item)) {
      var index = highlighted.values.indexOf(item);
      if (index > -1) {
        highlighted.values.splice(index, 1);
      }
    } else {
      highlighted.values.push(item);
    }
  }

  // allow only highlightening that obeys to the rules
  handleHighlighting(listKey, item, ctrlPressed, shiftPressed) {
    //tabIndex 2 for navigators, 3 for fields
    var highlighted = this.state.highlightedElements;
    var available = listKey === 'navigatoren1' ? this.state.leftElements : this.state.rightElements;

    if (highlighted.key === listKey) {
      if (shiftPressed) {
        this.handleShiftClick(highlighted, available, item);
      } else if (ctrlPressed) {
        this.handleCtrlClick(highlighted, item);
      } else {
        this.handleSingleClick(highlighted, available, item);
      }
    } else {
      highlighted.key = listKey;
      highlighted.values = [];
      this.handleSingleClick(highlighted, available, item);
    }

    this.setState({ highlightedElements: highlighted });
  }

  /*
    moves the highlighted Aktive Navigatoren (! only one) entry one position up
    */
  moveUp() {
    var activeList = this.state.rightElements;
    var highlightedList = this.state.highlightedElements;

    if (
      highlightedList.values !== undefined &&
      highlightedList.key !== undefined &&
      highlightedList.key === 'navigatoren2'
    ) {
      var arr = activeList;
      for (var i = 0; i < activeList.length; i++) {
        var element = activeList[i];
        var elementAbove = activeList[i - 1];
        const isHighlighted = highlightedList.values.includes(element);
        const canMoveUp = i > 0 && !highlightedList.values.includes(elementAbove);
        if (!isHighlighted || !canMoveUp) {
          arr[i] = element;
          continue;
        }
        arr[i] = elementAbove;
        arr[i - 1] = element;
      }

      this.setState({ rightElements: arr });
    }
  }

  /*
    moves the highlighted Aktive Navigatoren (! only one) entry one position down
    */
  moveDown() {
    var activeList = this.state.rightElements;
    var highlightedList = this.state.highlightedElements;

    if (
      highlightedList.values !== undefined &&
      highlightedList.key !== undefined &&
      highlightedList.key === 'navigatoren2'
    ) {
      var arr = activeList;
      for (var i = activeList.length - 1; i >= 0; i--) {
        var element = activeList[i];
        var elementBeneath = activeList[i + 1];
        const isHighlighted = highlightedList.values.includes(element);
        const canMoveDown = i < activeList.length - 1 && !highlightedList.values.includes(elementBeneath);
        if (!isHighlighted || !canMoveDown) {
          arr[i] = element;
          continue;
        }
        arr[i] = elementBeneath;
        arr[i + 1] = element;
      }

      this.setState({ rightElements: arr });
    }
  }

  /*
    moves the highlighted entries from Aktive Navigatoren to Verfügbare Navigatoren
    make sure the second tab is active and the highlighted entries are in the right column
    */
  moveToRight() {
    if (
      this.state.highlightedElements &&
      this.state.highlightedElements.key &&
      this.state.highlightedElements.key === 'navigatoren1'
    ) {
      var newAvailable = this.state.leftElements.filter((x) => !this.state.highlightedElements.values.includes(x));
      var newActive = this.state.rightElements.concat(this.state.highlightedElements.values);

      this.setState({
        rightElements: newActive,
        leftElements: newAvailable,
        highlightedElements: {},
      });
    }
  }

  /*
    moves the highlighted entries from Verfügbare Navigatoren to Aktive Navigatoren
    make sure the second tab is active and the highlighted entries are in the left column
    */
  moveToLeft() {
    if (
      this.state.highlightedElements &&
      this.state.highlightedElements.key &&
      this.state.highlightedElements.key === 'navigatoren2'
    ) {
      var newActive = this.state.rightElements.filter((x) => !this.state.highlightedElements.values.includes(x));
      var newAvailable = this.state.leftElements.concat(this.state.highlightedElements.values);

      this.setState({
        rightElements: newActive,
        leftElements: newAvailable,
        highlightedElements: {},
      });
    }
  }

  /**
   * Checks if the given string contains the given search text (ignores case)
   * @param {String} item Item to check for matching search text
   * @param {String} searchText Search text to be matched
   */
  filterElements(item, searchText) {
    return !searchText || searchText === '' || item.toUpperCase().includes(searchText.toUpperCase());
  }

  render() {
    const buttons = [
      {
        text: this.props.buttonText,
        callback: () => {
          this.props.toggleVisibility();
          this.props.apply(this.state.rightElements);
          this.props.buttonActions();
        },
      },
    ];
    return (
      <SettingsAreaTab buttons={buttons} {...this.props}>
        <Row>
          <Col sm="6" className="acol">
            <p>{this.props.leftTitle}</p>

            <FormGroup>
              <Input
                type="text"
                name="leftSearch"
                placeholder="Filter..."
                onChange={(e) => {
                  this.setState({ leftSearchText: e.target.value });
                }}
              />
            </FormGroup>

            <DefaultLoadingOverlay active={!this.props.allElements || this.props.allElements.length === 0} spinner>
              <div className="box-list">
                <ul id="settingsList" className="list-group">
                  {this.state.leftElements
                    .filter((item) => {
                      return this.filterElements(item, this.state.leftSearchText);
                    })
                    .map((item) => (
                      <li
                        key={uniqid()}
                        className={
                          this.state.highlightedElements !== undefined &&
                          this.state.highlightedElements.key !== undefined &&
                          this.state.highlightedElements.key === 'navigatoren1' &&
                          this.state.highlightedElements.values.includes(item)
                            ? 'list-group-item container-data list-value highlighted'
                            : 'list-group-item container-data list-value'
                        }
                        onClick={(e) => this.handleHighlighting('navigatoren1', item, e.ctrlKey, e.shiftKey)}
                      >
                        {item}
                      </li> // container-data navigator-value highlighted
                    ))}
                </ul>
              </div>
            </DefaultLoadingOverlay>
          </Col>

          <Col sm="0.5" className="acol justify-content-center">
            <div
              className="fa fa-chevron-right mb-3"
              onClick={() => this.moveToRight()}
              data-toggle="tooltip"
              title="Move right"
            ></div>
            <div
              className="fa fa-chevron-left"
              onClick={() => this.moveToLeft()}
              data-toggle="tooltip"
              title="Move left"
            ></div>
          </Col>
          <Col sm="5" className="acol">
            <p>{this.props.rightTitle}</p>

            <FormGroup>
              <Input
                type="text"
                name="rightSearch"
                placeholder="Filter..."
                onChange={(e) => {
                  this.setState({ rightSearchText: e.target.value });
                }}
              />
            </FormGroup>

            <div className="box-list">
              <ul id="settingsList" className="list-group">
                {this.state.rightElements
                  .filter((item) => {
                    return this.filterElements(item, this.state.rightSearchText);
                  })
                  .map((item) => (
                    <li
                      key={uniqid()}
                      className={
                        this.state.highlightedElements !== undefined &&
                        this.state.highlightedElements.key !== undefined &&
                        this.state.highlightedElements.key === 'navigatoren2' &&
                        this.state.highlightedElements.values.includes(item)
                          ? 'list-group-item container-data list-value highlighted'
                          : 'list-group-item container-data list-value'
                      }
                      onClick={(e) => this.handleHighlighting('navigatoren2', item, e.ctrlKey, e.shiftKey)}
                    >
                      {item}
                    </li>
                  ))}
              </ul>
            </div>
          </Col>
          <Col sm="0.5" className="acol justify-content-center mr-2">
            <div
              className="fa fa-chevron-up mb-3"
              onClick={() => this.moveUp()}
              data-toggle="tooltip"
              title="Move up"
            ></div>
            <div
              className="fa fa-chevron-down"
              onClick={() => this.moveDown()}
              data-toggle="tooltip"
              title="Move down"
            ></div>
          </Col>
        </Row>
      </SettingsAreaTab>
    );
  }
}

export default SettingsAreaTabList;
