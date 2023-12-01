import SettingsAreaTab from './SettingsAreaTab';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { saveViewsAction } from '../../Redux/actions';
import { selectViews } from '../../Redux/selectors';

class SettingsAreaTabSave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewName: '',
      saveTime: false,
      description: '',
    };

    this.saveView = this.saveView.bind(this);
  }

  saveView() {
    let viewName = this.state.viewName;
    let description = this.state.description;

    //console.log("saving view with name: " + viewName + " and time: " + saveTime);
    var ids = new Set();
    this.props.views.map((v) => ids.add(v.id));

    // string has only whitespace (ie. spaces, tabs or line breaks)
    if (viewName.length === 0 || !viewName.replace(/\s/g, '').length) {
      toast.error('Please enter a view name');
      this.setState({ viewName: this.state.viewName.replace(/\s/g, '') });
    } else if (
      ids.has(viewName) &&
      !window.confirm('Name exists.  Do you want to proceed with the action and update the existing user settings?')
    ) {
      this.setState({ viewName: '' });
    } else {
      this.props.saveDocument(viewName, description, this.state.saveTime, () => {
        toast.info('User setting was saved successfully!');
        this.props.toggleVisibility();
      });
    }
  }

  render() {
    const buttons = [{ text: 'Save', callback: this.saveView }];
    return (
      <SettingsAreaTab buttons={buttons} {...this.props}>
        <form>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">View Name: </label>
            <div className="col-sm-8">
              <input
                className="form-control"
                value={this.state.viewName}
                onChange={(data) => this.setState({ viewName: data.target.value })}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Description: </label>
            <div className="col-sm-8">
              <input
                className="form-control"
                value={this.state.description}
                onChange={(data) => this.setState({ description: data.target.value })}
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={this.state.saveTime}
                  onChange={(data) => this.setState({ saveTime: data.target.checked })}
                />
                <label className="form-check-label">Save Timespan</label>
              </div>
            </div>
          </div>
        </form>
      </SettingsAreaTab>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    views: selectViews(state),
  };
};

const mapDispatchToProps = {
  saveDocument: saveViewsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsAreaTabSave);
