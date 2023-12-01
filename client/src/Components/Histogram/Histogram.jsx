//import { Line } from 'react-chartjs-2';
import Chart from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';

import 'chartjs-plugin-select';
import 'chartjs-plugin-zoom';
import 'moment';
import { connect } from 'react-redux';
import { selectHistogramData, selectHistogramType } from '../../Redux/selectors';
import { changeTime, fetchHistogramData } from '../../Redux/actions';

const HISTOGRAM_FORMAT_TOOLTIP = 'YYYY-MM-DD HH:mm';
const HISTOGRAM_FORMAT_DAY = 'DD.MM.';
const HISTOGRAM_FORMAT_HOUR = 'DD.MM. HH:mm';
const HISTOGRAM_FORMAT_MINUTE = 'HH:mm';
const HISTOGRAM_FORMAT_SECOND = 'HH:mm:ss';

function Histogram(props) {
  const chartRef = useRef();
  const [myChart, setMyChart] = useState(null);
  const pointRadius = 1.2;
  const pufferPercantage = 15;

  const getPointRadiusList = (dataset) => {
    let pointRadiusList = [];
    dataset.forEach(
      (value, index) => {
          if ((value === 0) || (value === dataset[index - 1] && value === dataset[index + 1])) {
            pointRadiusList.push(0);
          } else {
            pointRadiusList.push(pointRadius);
          }
      });
    return pointRadiusList;
  }
  
  useEffect(() => {
    if (!myChart || !props.chartType || props.data.length === 0) {
      return;
    }
    myChart.options.scales.yAxes[0].type = props.chartType;
    myChart.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chartType])

  useEffect(() => {
    if (!myChart || !props.data || props.data.length === 0) {
      return;
    }

    // labels
    myChart.data.labels = props.data[0].map((d) => d.time);

    // clear all old datasets
    myChart.data.datasets.forEach((dataset) => {
      dataset.data.splice(0);
    });

    // set new datasets
    props.data.forEach((data, index) => {
      myChart.data.datasets[index].data = props.data[index].map((d) => d.value);
    });

    let bothDatasets = myChart.data.datasets[0].data.concat(myChart.data.datasets[1].data);
    //let minVal = Math.min(...bothDatasets.filter(Boolean))
    let maxVal = Math.max(...bothDatasets)
    let puffer = Math.ceil(pufferPercantage * maxVal / 100);

    //console.log(minVal)
    //console.log(maxVal)

    //myChart.data.datasets[0].pointRadius = myChart.data.datasets[0].data.map(val => val < 1 ? 0 : pointRadius);

    myChart.data.datasets[0].pointRadius = getPointRadiusList(myChart.data.datasets[0].data);
    myChart.data.datasets[1].pointRadius = getPointRadiusList(myChart.data.datasets[1].data);
    if (maxVal !== 0){
      myChart.options.scales.yAxes[0].ticks.min = 0;
      myChart.options.scales.yAxes[0].ticks.max = maxVal + puffer;
    }

    // update
    myChart.update();
  });

  useEffect(() => {
    setMyChart(
      new Chart(chartRef.current, {
        type: 'line',
        options: {
          legend: {
            display: false,
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                ticks: {
                  min: 0,
                  maxTicksLimit: 5,
                  maxRotation: 0,
                  minRotation: 0,
                },
                type: 'time',
                gridLines: {
                  display: false,
                },
                time: {
                  // round: 'day',
                  tooltipFormat: HISTOGRAM_FORMAT_TOOLTIP,
                  displayFormats: {
                    day: HISTOGRAM_FORMAT_DAY,
                    hour: HISTOGRAM_FORMAT_HOUR,
                    minute: HISTOGRAM_FORMAT_MINUTE,
                    second: HISTOGRAM_FORMAT_SECOND,
                  },
                },
              },
            ],
            yAxes: [
              {
                type: props.chartType,
               
                ticks: {
                  maxTicksLimit: 4,
                  max: 10,
                  min: 0, 
                  callback: value => Math.round(value)
                },
                gridLines: {
                  display: true,
                },
                
              },
            ],
          },
          plugins: {
            zoom: {
              // Container for zoom options
              zoom: {
                // Boolean to enable zooming
                enabled: true,

                // Drag-to-zoom rectangle style can be customized
                drag: {
                  borderColor: 'rgba(225,225,225,0.3)',
                  borderWidth: 5,
                  backgroundColor: 'rgb(225,225,225)',
                },

                // Zooming directions. Remove the appropriate direction to disable
                // Eg. 'y' would only allow zooming in the y direction
                // A function that is called as the user is zooming and returns the
                // available directions can also be used:
                //   mode: function({ chart }) {
                //     return 'xy';
                //   },
                mode: 'x',

                rangeMin: {
                  // Format of min zoom range depends on scale type
                  x: '00:00',
                  y: null,
                },
                rangeMax: {
                  // Format of max zoom range depends on scale type
                  x: '23:00',
                  y: null,
                },

                // Speed of zoom via mouse wheel
                // (percentage of zoom on a wheel event)
                speed: 0.1,

                // Function called while the user is zooming
                // onZoom: function({chart}) { console.log(`I'm zooming!!!`); },
                // Function called once zooming is completed
                onZoomComplete: (chart) => handleZoomComplete(chart['chart']),
              },
            },
          },
        },
        data: {
          datasets: [
            {
              fill: 'none',
              backgroundColor: props.color,
              pointRadius: 0,
              borderColor: props.color,
              borderWidth: 1,
              lineTension: 0.3,
            },

            {
              backgroundColor: '#EFEFEF',
              pointRadius: 0,
              borderColor: props.secondColor,
              borderWidth: 1,
              lineTension: 0.3,
            },
          ],
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleZoomComplete = (chart) => {
    const startTime = chart['scales']['x-axis-0']['min'];
    const endTime = chart['scales']['x-axis-0']['max'];
    props.changeTime({ startTime, endTime });
    chart.resetZoom();
    if (myChart !== null) {
      myChart.resetZoom();
    }
    // var ticks = chart['scales']['x-axis-0']['ticks'];
    // console.log(ticks[0]);
    // console.log(ticks[ticks.length-1]);
  };

  return (
    <div id="myChartDiv" style={{ padding: '0.5rem 0.5rem 0.5rem 0' }}>
      <canvas id="myChart" ref={chartRef} style={{ height: '156px' }} />
    </div>
  );
}

const mapStateToProps = (state) => ({
  data: selectHistogramData(state),
  chartType: selectHistogramType(state)
});

const mapDispatchToProps = {
  changeTime: changeTime,
  fetchHistogramData: fetchHistogramData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Histogram);
