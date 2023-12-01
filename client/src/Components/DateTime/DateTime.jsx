import React, { useState } from 'react';
import moment from 'moment';
import 'date-fns';

import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';
import { connect } from 'react-redux';

import DateTimePickerTheme from './DateTimePickerTheme';
import { Tooltip } from 'reactstrap';
import { changeStartTime, changeEndTime, changeTime } from '../../Redux/actions';
import { selectEndTime, selectStartTime, selectLiveViewActive } from '../../Redux/selectors';
import { getInitialTimeState } from '../../Redux/time/time.reducer';
import DateTimeButtonGroup from './DateTimeButtonGroup';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';

const DATE_TIME_START = 'date-time-start-cmt';
const DATE_TIME_END = 'date-time-end-cmt';
const DATE_TIME_ALL = 'date-time-all-cmt';

function DateTime(props) {
  const { changeTime, liveViewActive, startTime, changeStartTime, endTime, changeEndTime } = props;

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [startTimeLocal, setStartTimeLocal] = useState(startTime);
  const [endTimeLocal, setEndTimeLocal] = useState(endTime);

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };

  const onKeyDown = (e, id) => {
    if (e.key !== 'Enter') {
      return;
    }

    if (id === DATE_TIME_END) {
      changeEndTime(endTimeLocal.valueOf());
    } else if (id === DATE_TIME_START) {
      changeStartTime(startTimeLocal.valueOf());
    }
  };

  const resetStartTime = () => {
    const initialTimeState = getInitialTimeState();
    const { startTime, intermediateStartTime } = initialTimeState;

    changeTime({ startTime, intermediateStartTime });
  };

  const resetEndTime = () => {
    const initialTimeState = getInitialTimeState();
    const { endTime, intermediateEndTime } = initialTimeState;

    changeTime({ endTime, intermediateEndTime });
  };

  const resetToInitialTimeState = () => {
    const initialTimeState = getInitialTimeState();
    changeTime(initialTimeState);
  };

  const resetTime = (startDelta, endDelta, fromNow) => {
    let newTime;
    if (fromNow) {
      newTime = getNewStartAndEndDate(startDelta, endDelta);
    } else {
      newTime = getNewStartAndEndDate(startDelta, endDelta, startTime, endTime);
    }
    changeTime({
      startTime: newTime.start,
      intermediateStartTime: newTime.start,
      endTime: newTime.end,
      intermediateEndTime: newTime.end,
    });
    // todo: update facetSelected: {} and fetching...
  };

  return (
    <>
      <ContextMenuTrigger id={DATE_TIME_ALL}>
        {/*<ContextMenu
      menu={[
        new ContextMenuItem('Reset Start', resetStartTime),
        new ContextMenuItem('Reset End', resetEndTime),
        new ContextMenuItem('Reset Both', resetToInitialTimeState),
      ]}
    >*/}
        <div>
          <DateTimeButtonGroup resetTime={resetTime} disabled={liveViewActive} />
          <div id={'picker'} className={'p-3'}>
            <ThemeProvider theme={DateTimePickerTheme}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div className="date_header">
                  {/*<ContextMenu menu={[new ContextMenuItem('Reset', resetStartTime)]}>*/}
                  <ContextMenuTrigger id={DATE_TIME_START}>
                    <KeyboardDateTimePicker
                      disabled={liveViewActive}
                      id="datetime-local"
                      animateYearScrolling={true}
                      label="Start Date/Time"
                      format="dd.MM.yyyy   HH:mm"
                      ampm={false}
                      showTodayButton
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(date) => {
                        setStartTimeLocal(date)
                        changeStartTime(date.valueOf())
                      }}
                      onKeyDown={(e) => onKeyDown(e, DATE_TIME_START)}
                      value={startTime}
                      maxDate={endTime}
                      onAccept={(date) => {
                        changeStartTime(date.valueOf());
                      }}
                      size={'small'}
                      style={{ width: '100%', marginBottom: '12px' }}
                    />
                    {/*</ContextMenu>*/}
                  </ContextMenuTrigger>
                </div>

                <div className="date_footer">
                  {/*<ContextMenu menu={[new ContextMenuItem('Reset', resetEndTime)]}>*/}
                  <ContextMenuTrigger id={DATE_TIME_END}>
                    <KeyboardDateTimePicker
                      disabled={liveViewActive}
                      id="datetime-local-endTime"
                      animateYearScrolling={true}
                      format="dd.MM.yyyy   HH:mm"
                      ampm={false}
                      showTodayButton
                      label="End Date/Time"
                      value={endTime}
                      minDate={startTime}
                      onChange={(date) => {
                        setEndTimeLocal(date)
                        changeEndTime(date.valueOf())
                      }}
                      onKeyDown={(e) => onKeyDown(e, DATE_TIME_END)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onAccept={(date) => {
                        changeEndTime(date.valueOf());
                      }}
                      size={'small'}
                      style={{ width: '100%' }}
                    />
                    {/*</ContextMenu>*/}
                  </ContextMenuTrigger>
                </div>
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </div>

          <Tooltip placement="bottom-end" target="picker" isOpen={tooltipOpen && liveViewActive} toggle={toggleTooltip}>
            You cannot edit start and end time while live view is activated
          </Tooltip>
        </div>
        {/*</ContextMenu>*/}
      </ContextMenuTrigger>
      <ContextMenu id={DATE_TIME_ALL}>
        <MenuItem onClick={resetStartTime} data={{ item: 'item 1' }}>
          Reset Start
        </MenuItem>
        <MenuItem onClick={resetEndTime} data={{ item: 'item 1' }}>
          Reset End
        </MenuItem>
        <MenuItem divider />
        <MenuItem onClick={resetToInitialTimeState} data={{ item: 'item 1' }}>
          Reset Both
        </MenuItem>
      </ContextMenu>

      <ContextMenu id={DATE_TIME_START}>
        <MenuItem onClick={resetStartTime} data={{ item: 'item 1' }}>
          Reset
        </MenuItem>
      </ContextMenu>

      <ContextMenu id={DATE_TIME_END}>
        <MenuItem onClick={resetEndTime} data={{ item: 'item 1' }}>
          Reset
        </MenuItem>
      </ContextMenu>
    </>
  );
}

function getNewStartAndEndDate(startDelta, endDelta, startTime, endTime) {
  const start = moment(startTime).add(startDelta.val, startDelta.unit).valueOf();
  const end = moment(endTime).add(endDelta.val, endDelta.unit).valueOf();
  return {
    start,
    end,
  };
}

const mapStateToProps = (state) => {
  return {
    startTime: selectStartTime(state),
    endTime: selectEndTime(state),
    liveViewActive: selectLiveViewActive(state),
  };
};

const mapDispatchToProps = {
  changeStartTime: changeStartTime,
  changeEndTime: changeEndTime,
  changeTime: changeTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(DateTime);
