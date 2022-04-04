import { useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import { Project } from "../../../common/models/project";
import { Trade } from "../../../common/models/trade";
import { Container } from "../../styles";
import { StatsSnapshot, calculateStatsHistory } from "./calculateStats";
import { usd } from "../../../common/tradeUtils";
import numeral from "numeral";
import styled from "styled-components";

const StatisticItem = styled.div`
  display: flex;
  padding: 0.25rem;

  .statistic-name {
    min-width: 20em;
    vertical-align: middle;
  }

  .all-trades, .long-trades, .short-trades, .neutral-trades {
    text-align: right;
    min-width: 10em;
  }

  &:hover {
    background-color: rgba(64, 70, 79, 0.2);
    cursor: pointer;
    border-radius: 5px;
  }
`;

interface Props {
  project: Project;
  trades: Trade[];
  loading: boolean;
}

const getClosedTrades = (trades: Trade[]) => {
  return trades.filter((trade) => trade.closeDate);
};

const Report = ({ project, trades, loading }: Props) => {
  const [history, setHistory] = useState<StatsSnapshot[]>([]);

  useEffect(() => {
    if (trades && getClosedTrades(trades).length) {
      const closedTrades = getClosedTrades(trades);
      setHistory(calculateStatsHistory(project.startingBalance, project.risk, closedTrades));
    }
  }, [project.risk, project.startingBalance, trades]);

  if (loading || !trades) {
    return null;
  }

  if (!getClosedTrades(trades).length) {
    return (
      <Container>
        <h2 className="text-center fw-normal">No closed trades yet...</h2>
      </Container>
    );
  }

  if (history.length === 0) {
    return null;
  }

  const current = history[history.length - 1].stats;

  return (
    <Container style={{ width: "fit-content", marginBottom: "2em" }}>
      <StatisticItem>
        <div className="statistic-name" />
        <div className="all-trades"><b>All trades</b></div>
        <div className="long-trades"><b>Long trades</b></div>
        <div className="short-trades"><b>Short trades</b></div>
        <div className="neutral-trades"><b>Neutral trades</b></div>
      </StatisticItem>
      <hr />
      {/* Balance */}
      {project.startingBalance && (
        <StatisticItem>
          <div className="statistic-name">Balance</div>
          <div className="all-trades">{usd.format(current.currentBalance)}</div>
        </StatisticItem>
      )}
      {/* Net profit */}
      <StatisticItem>
        <div className="statistic-name">Net profit</div>
        <div className="all-trades">{usd.format(current.netProfit)}</div>
        <div className="long-trades">{usd.format(current.long.netProfit)}</div>
        <div className="short-trades">{usd.format(current.short.netProfit)}</div>
        <div className="neutral-trades">{usd.format(current.neutral.netProfit)}</div>
      </StatisticItem>
      {/* Net profit % */}
      {project.startingBalance && (
        <StatisticItem>
          <div className="statistic-name">Net profit %</div>
          <div className="all-trades">{(current.netProfitPercent * 100).toFixed(2)}%</div>
          <div className="long-trades">{(current.long.netProfitPercent * 100).toFixed(2)}%</div>
          <div className="short-trades">{(current.short.netProfitPercent * 100).toFixed(2)}%</div>
          <div className="neutral-trades">{(current.neutral.netProfitPercent * 100).toFixed(2)}%</div>
        </StatisticItem>
      )}
      {/* Gross profit */}
      <StatisticItem>
        <div className="statistic-name">Gross profit</div>
        <div className="all-trades">{usd.format(current.grossProfit)}</div>
        <div className="long-trades">{usd.format(current.long.grossProfit)}</div>
        <div className="short-trades">{usd.format(current.short.grossProfit)}</div>
        <div className="neutral-trades">{usd.format(current.neutral.grossProfit)}</div>
      </StatisticItem>
      {/* Gross loss */}
      <StatisticItem>
        <div className="statistic-name">Gross loss</div>
        <div className="all-trades">{usd.format(current.grossLoss)}</div>
        <div className="long-trades">{usd.format(current.long.grossLoss)}</div>
        <div className="short-trades">{usd.format(current.short.grossLoss)}</div>
        <div className="neutral-trades">{usd.format(current.neutral.grossLoss)}</div>
      </StatisticItem>
      {/* Profit factor */}
      <StatisticItem>
        <div className="statistic-name">Profit factor</div>
        <div className="all-trades">{current.profitFactor.toFixed(2)}</div>
        <div className="long-trades">{current.long.profitFactor.toFixed(2)}</div>
        <div className="short-trades">{current.short.profitFactor.toFixed(2)}</div>
        <div className="neutral-trades">{current.neutral.profitFactor.toFixed(2)}</div>
      </StatisticItem>
      {/* Alpha */}
      {project.startingBalance && (
        <StatisticItem>
          <div className="statistic-name">Alpha</div>
          <div className="all-trades">{(current.alpha * 100).toFixed(2)}%</div>
        </StatisticItem>
      )}

      <br />

      {/* Total number of trades */}
      <StatisticItem>
        <div className="statistic-name">Total number of trades</div>
        <div className="all-trades">{current.totalTrades}</div>
        <div className="long-trades">{current.long.totalTrades}</div>
        <div className="short-trades">{current.short.totalTrades}</div>
        <div className="neutral-trades">{current.neutral.totalTrades}</div>
      </StatisticItem>
      {/* Percent profitable */}
      <StatisticItem>
        <div className="statistic-name">Percent profitable</div>
        <div className="all-trades">{(current.percentProfitable * 100).toFixed(2)}%</div>
        <div className="long-trades">{(current.long.percentProfitable * 100).toFixed(2)}%</div>
        <div className="short-trades">{(current.short.percentProfitable * 100).toFixed(2)}%</div>
        <div className="neutral-trades">{(current.neutral.percentProfitable * 100).toFixed(2)}%</div>
      </StatisticItem>
      {/* Winning trades */}
      <StatisticItem>
        <div className="statistic-name">Winning trades</div>
        <div className="all-trades">{current.winningTrades}</div>
        <div className="long-trades">{current.long.winningTrades}</div>
        <div className="short-trades">{current.short.winningTrades}</div>
        <div className="neutral-trades">{current.neutral.winningTrades}</div>
      </StatisticItem>
      {/* Losing trades */}
      <StatisticItem>
        <div className="statistic-name">Losing trades</div>
        <div className="all-trades">{current.losingTrades}</div>
        <div className="long-trades">{current.long.losingTrades}</div>
        <div className="short-trades">{current.short.losingTrades}</div>
        <div className="neutral-trades">{current.neutral.losingTrades}</div>
      </StatisticItem>
      {/* Even trades */}
      <StatisticItem>
        <div className="statistic-name">Even trades</div>
        <div className="all-trades">{current.evenTrades}</div>
        <div className="long-trades">{current.long.evenTrades}</div>
        <div className="short-trades">{current.short.evenTrades}</div>
        <div className="neutral-trades">{current.neutral.evenTrades}</div>
      </StatisticItem>

      <br />

      {/* Avg. trade net profit */}
      <StatisticItem>
        <div className="statistic-name">Avg. trade net profit</div>
        <div className="all-trades">{usd.format(current.averageProfitLoss)}</div>
        <div className="long-trades">{usd.format(current.long.averageProfitLoss)}</div>
        <div className="short-trades">{usd.format(current.short.averageProfitLoss)}</div>
        <div className="neutral-trades">{usd.format(current.neutral.averageProfitLoss)}</div>
      </StatisticItem>
      {/* Avg. gain*/}
      <StatisticItem>
        <div className="statistic-name">Avg. gain</div>
        <div className="all-trades">{usd.format(current.averageGain)}</div>
        <div className="long-trades">{usd.format(current.long.averageGain)}</div>
        <div className="short-trades">{usd.format(current.short.averageGain)}</div>
        <div className="neutral-trades">{usd.format(current.neutral.averageGain)}</div>
      </StatisticItem>
      {/* Avg. loss */}
      <StatisticItem>
        <div className="statistic-name">Avg. loss</div>
        <div className="all-trades">{usd.format(current.averageLoss)}</div>
        <div className="long-trades">{usd.format(current.long.averageLoss)}</div>
        <div className="short-trades">{usd.format(current.short.averageLoss)}</div>
        <div className="neutral-trades">{usd.format(current.neutral.averageLoss)}</div>
      </StatisticItem>
      {/* Gain/Loss ratio */}
      <StatisticItem>
        <div className="statistic-name">Gain/Loss ratio</div>
        <div className="all-trades">{current.gainLossRatio.toFixed(2)}</div>
        <div className="long-trades">{current.long.gainLossRatio.toFixed(2)}</div>
        <div className="short-trades">{current.short.gainLossRatio.toFixed(2)}</div>
        <div className="neutral-trades">{current.neutral.gainLossRatio.toFixed(2)}</div>
      </StatisticItem>

      <br />

      {/* Annualized return */}
      {project.startingBalance && (
        <>
          <StatisticItem>
            <div className="statistic-name">Annualized return</div>
            <div className="all-trades">{(current.annualizedProfitPercent * 100).toFixed(2)}%</div>
          </StatisticItem>

          <br />
        </>
      )}

      {/* Sharpe ratio */}
      <StatisticItem>
        <div className="statistic-name">Sharpe ratio</div>
        <div className="all-trades">{(current.sharpeRatio).toFixed(2)}</div>
      </StatisticItem>
      {/* Avg. return on risk */}
      <StatisticItem>
        <div className="statistic-name">Avg. return on risk</div>
        <div className="all-trades">{(current.averageReturnOnRisk * 100).toFixed(2)}%</div>
      </StatisticItem>

      <br />

      {/* Trading period */}
      <StatisticItem>
        <div className="statistic-name">Trading period</div>
        <div className="all-trades">{humanizeDuration(current.tradingPeriodDays * 1000 * 3600 * 24, {
          units: ["y", "mo", "d"],
          maxDecimalPoints: 0
        })}</div>
      </StatisticItem>
      {/* Avg. trade length */}
      <StatisticItem>
        <div className="statistic-name">Avg. trade length</div>
        <div className="all-trades">{numeral(current.averageDurationDays).format("0,0")} days</div>
        <div className="long-trades">{numeral(current.long.averageDurationDays).format("0,0")} days</div>
        <div className="short-trades">{numeral(current.short.averageDurationDays).format("0,0")} days</div>
        <div className="neutral-trades">{numeral(current.neutral.averageDurationDays).format("0,0")} days</div>
      </StatisticItem>

      <br />

      {/* Kelly % */}
      <StatisticItem>
        <div className="statistic-name">Kelly %</div>
        <div className="all-trades">{(current.kellyPercentage * 100).toFixed(2)}%</div>
      </StatisticItem>
      {/* Risk per trade % */}
      {project.risk && (
        <StatisticItem>
          <div className="statistic-name">Risk per trade ({project.risk}%)</div>
          <div className="all-trades">{usd.format(current.riskPerTrade)}</div>
        </StatisticItem>
      )}
    </Container>
  );
};

export default Report;