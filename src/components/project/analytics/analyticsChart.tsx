import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import React from "react";
import styled from "styled-components";

const ChartContainer = styled.div`
  .highcharts-button {
    rect {
      fill: ${props => props.theme.dark.button.bg} !important;
    }

    text {
      fill: ${props => props.theme.dark.button.text} !important;
    }
    
    &.highcharts-button-pressed {
      rect {
        fill: ${props => props.theme.dark.button.hover.bg} !important;
      }
    }

    &.highcharts-button-hover {
      rect {
        fill: ${props => props.theme.dark.button.hover.bg} !important;
      }
    }

    &.highcharts-button-disabled {
      opacity: 0.5;
    }
  }
  
  .highcharts-label.highcharts-range-input text {
    fill: ${props => props.theme.dark.text} !important;
  }
`;

export const AnalyticsChart = ({ property, history, valueTransform = (n) => n, valueTextTransform = (n) => n}) => {
  const options = {
    chart: {
      type: "areaspline",
      backgroundColor: "#0d1117",
      style: {
        color: "#c9d1d9"
      }
    },
    title: undefined,
    rangeSelector: {
      //selected: 1,
    },
    navigator: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    },
    series: [
      {
        data: history.map((h) => {
          const value = valueTransform(h.analytics[property]);
          return {
            x: h.date.getTime(),
            y: value,
            label: valueTextTransform(value),
            color: value >= 0 ? "#1b7c1f" : "#cb0707"
          };
        }),
        color: "#1b7c1f",
        negativeColor: "#cb0707",
        fillOpacity: 0.5,
        animation: false
      }
    ],
    xAxis: {
      lineColor: "#c9d1d9",
      labels: {
        style: {
          color: "#c9d1d9"
        }
      },
      tickColor: "#c9d1d9"
    },
    yAxis: {
      gridLineColor: "#30363d",
      labels: {
        align: "left",
        x: 2,
        y: 0,
        style: {
          color: "#c9d1d9"
        }
      },
      tickColor: "#c9d1d9"
    },
    tooltip: {
      backgroundColor: "#21262d",
      borderRadius: 10,
      pointFormat: "{point.label}",
      style: {
        color: "#c9d1d9"
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          chart: {
            height: 200
          },
          navigator: {
            enabled: false
          }
        }
      }]
    }
  };

  return (
    <ChartContainer>
      <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={options} />
    </ChartContainer>
  );
};