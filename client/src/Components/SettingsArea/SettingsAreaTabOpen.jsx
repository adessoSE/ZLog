import React, { Component } from 'react';
import uniqid from 'uniqid';

import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';

import SettingsAreaTab from './SettingsAreaTab';
import Pagination from '@material-ui/lab/Pagination';
import DefaultLoadingOverlay from '../../utils/DefaultLoadingOverlay';
import { connect } from 'react-redux';
import { selectNumPagesForViews, selectViews } from '../../Redux/selectors';
import { applySettings, deleteSetting, fetchCurrentSettings, setToDefaultSetting } from '../../Redux/actions';
import { withRouter } from 'react-router-dom';

class SettingsAreaTabOpen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSetting: -1,
      sText: '',
      currentPage: 1,
      viewName: '',
    };
    this.changeViewName = this.changeViewName.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
  }

  handleChangePage(event, number) {
    this.setState({ currentPage: number, selectedSetting: -1 }, () => {
      this.props.fetchCurrentSettings(number - 1, this.state.sText);
    });
  }

  changeViewName(name) {
    this.setState({ viewName: name });
  }

  // TODO see how many times the request is sent (the first time(s))
  render() {
    const history = this.props.history;
    const buttons = [
      {
        text: 'Open',
        callback: () => {
          if (this.state.selectedSetting !== -1){
            history.push(`/logging/view/${this.props.views[this.state.selectedSetting].id}`);
            this.props.applySettings(this.props.views[this.state.selectedSetting].settings);
            //this.props.onSelectView(this.props.views[this.state.selectedSetting]);
            this.props.toggleVisibility();
          }
        },
      },
      {
        text: 'Set to default',
        callback: () => {
          history.push(`/logging`);
          this.props.setToDefaultSetting();
          this.props.toggleVisibility();
        },
      },
    ];
    return (
      <SettingsAreaTab viewName={this.state.viewName} buttons={buttons} {...this.props}>
        <div className="box-list">
          <FormGroup>
            <Input
              type="text"
              name="leftSearch"
              placeholder="Filter..."
              onChange={(e) => {
                this.setState({ sText: e.target.value }, () => {
                  this.props.fetchCurrentSettings(0, this.state.sText);
                });
              }}
            />
          </FormGroup>
          <DefaultLoadingOverlay
            active={this.props.numPagesForViews !== -1 && (!this.props.views || this.props.views.length === 0)}
            spinner
          >
            <ul id="settingsList" className="list-group">
              {this.props.numPagesForViews !== 0 &&
                this.props.views.length !== 0 &&
                this.props.views.map((item, i) => {
                  return (
                    <li
                      key={uniqid()}
                      className={
                        i === this.state.selectedSetting
                          ? 'list-group-item container-data settings-list-value highlighted'
                          : 'list-group-item container-data settings-list-value'
                      }
                      onClick={() => this.setState({ selectedSetting: i, viewName: this.props.views[i].id })}
                    >
                      <p className="comment-title d-flex justify-content-between">
                        {item.id}{' '}
                        {i === this.state.selectedSetting && (
                          <span
                            className="fa fa-trash mt-2"
                            data-toggle="tooltip"
                            title="Delete"
                            onClick={() => {
                              var old = this.props.numPagesForViews; // numbering starts from 1 for the pagination, and from 0 for Solr
                              this.props
                                .deleteSetting(
                                  this.props.views[this.state.selectedSetting].id,
                                  this.state.currentPage - 1
                                )
                                .then(() => {
                                  this.setState({ selectedSetting: -1 }, () => {
                                    //console.log(this.props.numPagesForViews, old);
                                    if (this.props.numPagesForViews < old) {
                                      this.setState({ currentPage: old - 1, selectedSetting: -1 }, () => {
                                        // this.props.fetchCurrentSettings(this.state.currentPage-1);
                                      });
                                    }
                                  });
                                });
                            }}
                          ></span>
                        )}
                      </p>
                      <p className="comment-description">{item.description !== undefined ? item.description : ''}</p>
                    </li>
                  );
                })}
            </ul>
          </DefaultLoadingOverlay>
          <div>
            {
              <Pagination
                count={this.props.numPagesForViews}
                color="primary"
                onChange={this.handleChangePage}
                className="d-flex justify-content-end mt-2 mb-2"
                page={this.state.currentPage}
                defaultPage={1}
              />
            }
          </div>
        </div>
      </SettingsAreaTab>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    views: selectViews(state),
    numPagesForViews: selectNumPagesForViews(state),
  };
};

const mapDispatchToProps = {
  fetchCurrentSettings: fetchCurrentSettings,
  deleteSetting: deleteSetting,
  applySettings: applySettings,
  setToDefaultSetting: setToDefaultSetting,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SettingsAreaTabOpen));
