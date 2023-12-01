import classnames from 'classnames';
import React from 'react';
import { Button, Modal, ModalHeader, Nav, NavItem, NavLink, ButtonGroup, ButtonToolbar } from 'reactstrap';

import SettingsAreaTabList from './SettingsAreaTabList';
import SettingsAreaTabOpen from './SettingsAreaTabOpen';
import SettingsAreaTabSave from './SettingsAreaTabSave';
import SettingsAreaTabLiveView from './SettingsAreaTabLiveView';

import '../../SCSS/SettingsArea.scss';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { REQ_DOWNLOAD_CSV } from '../../utils/requestTypes';
import Icon from '../Shared/Icon';
import * as Actions from '../../Redux/actions';
import * as Selectors from '../../Redux/selectors';

class SettingsArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // visibility of settings
      modal: false,

      // number of current tab
      activeTab: '3',
      viewName: '',

      // we only need a local copy of active fields, which we change
      // all-fields stays the same
      activeFields: props.activeFields,
      availableFields: [],
      highlightedFields: {},
    };

    //this.toggle = this.toggle.bind(this);
    this.changeActive = this.changeActive.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.applyNavigators = this.applyNavigators.bind(this);
    this.handleView = this.handleView.bind(this);
  }
  handleView(view) {
    this.setState(() => ({
      viewName: view.id,
    }));
  }
  /**
   * Toggles visibility of settings. Fetches active navigators and fields
   */
  toggleVisibility() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
      highlightedFields: {},
      highlightedNavigators: {},
      saveTime: false,
      description: '',
    }));

    //if it is visible, reset active fields and available fields depending on props
    if (!this.state.modal) {
      this.setState({
        activeFields: this.props.activeFields,
        availableFields: this.props.allFields.filter((x) => !this.props.activeFields.includes(x)),
      });
      this.props.fetchCurrentSettings(0);
    }
  }

  applyNavigators(elements) {
    this.props.setActiveNavigators(elements);
    this.props.fetchAdditionalFacetsByType(elements);
  }

  /**
   * Changes active tab. param tap: 1 <= tab <= 4
   * @param {Number} tab Tab Id
   */
  changeActive(tab) {
    if (this.state.activeTab !== tab) {
      this.setState(() => ({
        activeTab: tab,
      }));
    }
  }

  renderLiveViewStatusIcon() {
    if (!this.props.isLiveViewActive) {
      return <Icon type={'stop'} />;
    }
    if (this.props.isLiveViewPaused) {
      return <Icon type={'pause'} />;
    }
    return <Icon type={'play'} />;
  }

  renderHistogrammTypeIcon(type) {
    return type;
  }

  render() {
    return (
      <>
        <ButtonToolbar style={{ flexWrap: 'nowrap' }}>
          <ButtonGroup className={'mr-2'}>
            <Button
              color={this.props.isLiveViewActive ? 'primary' : 'secondary'}
              onClick={() => {
                this.props.toggleLiveView();
                this.props.setLiveViewPaused(false); // always disable paused mode when toggling live view
              }}
              data-toggle="tooltip"
              title="Toggle Live View Active"
              style={{ whiteSpace: 'nowrap' }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>LIVE</span>
              <span style={{ marginLeft: '0.5rem' }}>{this.renderLiveViewStatusIcon()}</span>
            </Button>
          </ButtonGroup>
          <ButtonGroup className={'mr-2'}>
            <Button
              color="secondary"
              onClick={() => {
                if (this.props.histogrammType === 'logarithmic'){
                  this.props.changeHistogramType('linear');
                }else{
                  this.props.changeHistogramType('logarithmic');
                }
              }}
              data-toggle="tooltip"
              title="Toggle logarithmic or linear scale"
              style={{ whiteSpace: 'nowrap' }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{this.props.histogrammType.slice(0, 3).toUpperCase()}</span>
            </Button>
          </ButtonGroup>
          <ButtonGroup className={'mr-2'}>
            <Button
              color="secondary"
              onClick={() => this.props.setSortUp(!this.props.isSortUp)}
              data-toggle="tooltip"
              title="Toggle Sorting Direction"
            >
              {this.props.isSortUp ? <Icon type={'arrow-up'} /> : <Icon type={'arrow-down'} />}
            </Button>
            <Button
              color={this.props.showMarkedOnly ? 'primary' : 'secondary'}
              onClick={() => {
                if (!this.props.isAnyRowMarked && !this.props.showMarkedOnly) {
                  toast('No marked rows!', { type: 'info' });
                  return;
                }
                this.props.setIsMarkedOnly(!this.props.showMarkedOnly);
                this.props.fetchFromStartToEndAction();
                this.props.fetchHistogramData();
                this.props.fetchFacetsWithSearchTextAndFilter();
              }}
              data-toggle="tooltip"
              title="Toggle Show Marked Only"
            >
              <Icon type={'thumbtack'} />
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                // clear search text and filters, then fetch (fetch in FilterArea.jsx)
                this.props.setSearchText('');
                this.props.setSelectedFacetData({});
                if (this.props.isAnyFilterActive){
                  this.props.setFacetFilter({});
                } else {
                  this.props.fetchFromStartToEndAction();
                  this.props.fetchHistogramData();
                  this.props.fetchFacetsWithSearchTextAndFilter();
                }

              }}
              data-toggle="tooltip"
              title="Clear Search and Filters"
            >
              <Icon type={'times'} />
            </Button>
          </ButtonGroup>

          <ButtonGroup className={'mr-2'}>
            <Button
              color="secondary"
              disabled={this.props.isDownloadingCsv}
              onClick={this.props.downloadCSV}
              data-toggle="tooltip"
              title="Download as CSV"
            >
              {this.props.isDownloadingCsv ? <Icon type={'spinner'} spin /> : <Icon type={'download'} />}
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              color="secondary"
              onClick={() => {
                this.toggleVisibility();
              }}
              data-toggle="tooltip"
              title="Settings"
            >
              <Icon type={'cog'} />
            </Button>
          </ButtonGroup>
        </ButtonToolbar>

        <div>
          <Modal
            isOpen={this.state.modal}
            centered={true}
            contentClassName="modal-settings"
            id="settingsmodal"
            toggle={() => this.toggleVisibility()}
          >
            <ModalHeader
              className="modal-header-settings"
              tag="span"
              cssModule={{ 'modal-title': 'w-100 text-center' }}
            >
              <Nav tabs className="mb-3 nav-fill w-100">
                <NavItem className="nav-tab">
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => this.changeActive('1')}
                  >
                    Open
                  </NavLink>
                </NavItem>

                <NavItem className="nav-tab">
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => this.changeActive('2')}
                  >
                    Save
                  </NavLink>
                </NavItem>

                <NavItem className="nav-tab">
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => this.changeActive('3')}
                  >
                    Navigators
                  </NavLink>
                </NavItem>

                <NavItem className="nav-tab">
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => this.changeActive('4')}
                  >
                    Fields
                  </NavLink>
                </NavItem>

                <NavItem className="nav-tab">
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '5' })}
                    onClick={() => this.changeActive('5')}
                  >
                    Live View
                  </NavLink>
                </NavItem>
              </Nav>
            </ModalHeader>
            <SettingsAreaTabOpen
              activeTab={this.state.activeTab}
              tabId={'1'}
              onSelectView={this.handleView}
              //views={this.props.views}
              //numPagesForViews={this.props.numPagesForViews}
              toggleVisibility={this.toggleVisibility}
            />

            <SettingsAreaTabSave
              activeTab={this.state.activeTab}
              tabId={'2'}
              toggleVisibility={this.toggleVisibility}
            //views={this.props.views}
            />

            <SettingsAreaTabList
              activeTab={this.state.activeTab}
              tabId={'3'}
              leftTitle={'Available Navigators'}
              rightTitle={'Active Navigators'}
              buttonText={'Apply Navigators'}
              toggleVisibility={this.toggleVisibility}
              apply={this.applyNavigators}
              buttonActions={() => {
                this.props.fetchFromStartToEndAction();
                this.props.fetchHistogramData();
                this.props.fetchFacetsWithSearchTextAndFilter();
              }}
              activeElements={this.props.activeNavigators}
              allElements={this.props.allNavigators}
            />

            <SettingsAreaTabList
              activeTab={this.state.activeTab}
              tabId={'4'}
              leftTitle={'Available Fields'}
              rightTitle={'Active Fields'}
              buttonText={'Apply Fields'}
              buttonActions={() => {
                this.props.fetchFromStartToEndAction();
                this.props.fetchHistogramData();
                this.props.fetchFacetsWithSearchTextAndFilter();
              }}
              toggleVisibility={this.toggleVisibility}
              apply={this.props.setActiveFields}
              allElements={this.props.allFields}
              activeElements={this.props.activeFields}
            />

            <SettingsAreaTabLiveView
              activeTab={this.state.activeTab}
              tabId={'5'}
              toggleVisibility={this.toggleVisibility}
              liveViewFreqRedux={this.props.liveViewUpdateFrequency}
              setLiveViewFreqRedux={this.props.setLiveViewUpdateFrequency}
              liveViewUnitRedux={this.props.liveViewUnit}
              setLiveViewUnitRedux={this.props.setLiveViewUnit}
              save={this.props.save}
            />
          </Modal>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allFields: Selectors.selectAllFields(state),
    activeFields: Selectors.selectActiveFields(state),
    allNavigators: Selectors.selectAllNavigators(state),
    activeNavigators: Selectors.selectActiveNavigators(state),
    showMarkedOnly: Selectors.selectListMarkedOnly(state),
    isAnyRowMarked: Selectors.selectIsAnyRowMarked(state),
    isSortUp: Selectors.selectListSortUp(state),
    isDownloadingCsv: Selectors.selectIsRequestTypeActive(state, REQ_DOWNLOAD_CSV),
    isLiveViewActive: Selectors.selectLiveViewActive(state),
    liveViewUpdateFrequency: Selectors.selectLiveViewUpdateFrequency(state),
    isLiveViewPaused: Selectors.selectLiveViewPaused(state),
    liveViewUnit: Selectors.selectLiveViewUnit(state),
    isAnyFilterActive: Selectors.selectIsAnyFilterActive(state),
    histogrammType : Selectors.selectHistogramType(state),
  };
};

const mapDispatchToProps = {
  setAllFields: Actions.setAllFields,
  setActiveFields: Actions.setActiveFields,
  setAllNavigators: Actions.setAllNavigators,
  setActiveNavigators: Actions.setActiveNavigators,
  fetchCurrentSettings: Actions.fetchCurrentSettings,
  fetchAdditionalFacetsByType: Actions.fetchAdditionalFacetsByType,
  setIsMarkedOnly: Actions.setShowMarkedOnly,
  setSortUp: Actions.setSortUp,
  fetchFromStartToEndAction: Actions.fetchFromStartToEndAction,
  fetchHistogramData: Actions.fetchHistogramData,
  fetchFacetsWithSearchTextAndFilter: Actions.fetchFacetsWithSearchTextAndFilter,
  setSearchText: Actions.setSearchText,
  setFacetFilter: Actions.setFacetFilter,
  setSelectedFacetData: Actions.setSelectedFacetData,
  downloadCSV: Actions.downloadCSVAction,
  toggleLiveView: Actions.toggleLiveView,
  setLiveViewUpdateFrequency: Actions.setLiveViewFrequency,
  setLiveViewPaused: Actions.setLiveViewPaused,
  setLiveViewUnit: Actions.setLiveViewUnit,
  changeHistogramType: Actions.changeHistogramType,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsArea);
