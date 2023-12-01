import { Component } from 'react';
import { selectListData, selectLiveViewUnit } from '../../Redux/selectors';
import { selectLiveViewUpdateFrequency } from '../../Redux/selectors';
import { connect } from 'react-redux';
import { fetchNewerLogsAction } from '../../Redux/actions';

class LiveViewFetcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: null,
    };

    this.resetTimeout = this.resetTimeout.bind(this);
    this.recursiveFetchNew = this.recursiveFetchNew.bind(this);
  }

  getFrequencyMs() {
    //  const factor = getFactorForUnit(this.props.unit);
    const factor = 1;
    return this.props.liveViewUpdateFrequency * factor;
  }

  componentDidMount() {
    this.recursiveFetchNew();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
    this.setState({
      timeout: null,
    });
  }

  resetTimeout() {
    this.setState({
      timeout: setTimeout(this.recursiveFetchNew, this.getFrequencyMs()),
      //timeout: setTimeout(this.recursiveFetchNew, 20000),
    });
  }

  recursiveFetchNew() {
    this.props.fetchNewerLogsAction();
    this.resetTimeout();
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    liveViewUpdateFrequency: selectLiveViewUpdateFrequency(state),
    unit: selectLiveViewUnit(state),
    listData: selectListData(state),
  };
};

const mapDispatchToProps = { fetchNewerLogsAction };

export default connect(mapStateToProps, mapDispatchToProps)(LiveViewFetcher);
