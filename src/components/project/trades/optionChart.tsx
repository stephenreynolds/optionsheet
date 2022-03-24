import { blackScholes } from "black-scholes";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import _ from "lodash";
import styled from "styled-components";
import { Leg, PutCall, Side } from "../../../common/models/trade";
import { tradeIsOption, usd } from "../../../common/tradeUtils";

const ChartContainer = styled.div`
  background-color: ${props => props.theme.dark.fg};
  border: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
  padding: 0.5rem;

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

const calculateChart = (legs: Leg[]) => {
  let points = [];

  if (tradeIsOption(legs)) {
    const strikes = legs.map((l) => l.strike);
    const min = _.min(strikes);
    const max = _.max(strikes);
    const width = strikes.length > 1 ? (max - min) / 2 : legs[0].open_price * 2;

    for (let price = min - width; price <= max + width; price += 0.01) {
      points = [...points, {
        x: price + 1,
        y: 0,
        header: (price + 1).toFixed(2)
      }];
    }

    for (const leg of legs) {
      const optionType = leg.put_call === PutCall.Call ? "put" : "call";
      const side = leg.side === Side.Buy ? 1 : -1;

      for (let i = 0; i < points.length; ++i) {
        const bs = blackScholes(leg.strike, points[i].x - 1, 0, 0, 0, optionType);
        const pl = (bs - leg.open_price) * leg.quantity * 100 * side;
        points[i] = {
          ...points[i],
          y: pl + points[i].y,
          label: usd.format(pl + points[i].y)
        };
      }
    }
  }
  else {
    const min = legs[0].open_price * 0.75;
    const max = legs[0].open_price * 1.25;

    for (let price = min; price <= max; price += 0.01) {
      points = [...points, {
        x: price,
        header: price.toFixed(2)
      }];
    }

    for (let i = 0; i < points.length; ++i) {
      const leg = legs[0];
      const side = leg.side === Side.Buy ? 1 : -1;
      const pl = (points[i].x - leg.open_price) * leg.quantity * side;
      points[i] = {
        ...points[i],
        y: pl,
        label: usd.format(pl)
      };
    }
  }

  return points;
};

const OptionChart = ({ legs }: { legs: Leg[] }) => {
  const data = calculateChart(legs);

  const options = {
    chart: {
      type: "area",
      backgroundColor: "#161b22",
      style: {
        color: "#c9d1d9"
      }
    },
    title: undefined,
    rangeSelector: {
      selected: 1
    },
    navigator: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    },
    series: [
      {
        data,
        color: "#1b7c1f",
        negativeColor: "#cb0707",
        fillOpacity: 0.5,
        animation: false,
        turboThreshold: 100000
      }
    ],
    tooltip: {
      backgroundColor: "#21262d",
      borderRadius: 10,
      headerFormat: "",
      pointFormat: "Price: {point.header}<br />P/L: <b>{point.label}</b>",
      shape: "rect",
      style: {
        color: "#c9d1d9"
      }
    },
    legend: {
      enabled: false
    },
    xAxis: {
      visible: false
    },
    yAxis: {
      gridLineColor: "#30363d",
      labels: {
        align: "right",
        x: 0,
        y: 0,
        style: {
          color: "#c9d1d9"
        }
      },
      tickColor: "#c9d1d9",
      title: undefined,
      opposite: true
    }
  };

  return (
    <ChartContainer>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ChartContainer>
  );
};

export default OptionChart;