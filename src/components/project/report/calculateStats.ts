import _ from "lodash";
import { Trade } from "../../../common/models/trade";
import { TradeDirection, getTradeDirection } from "../../../common/strategy";
import { getReturnOnRisk, getTradeDurationDays } from "../../../common/tradeUtils";
import {
  getAlpha, getAnnualizedProfit,
  getAverageProfit,
  getEvenTrades,
  getGrossProfit, getKellyPercentage,
  getLosingTrades,
  getNetProfit, getPercentProfitable, getProfitLossFactor,
  getSharpeRatio, getTradingPeriodDays,
  getWinningTrades
} from "./stats";

export type StatsSnapshot = {
  date: Date,
  stats: StatsBundle
};

const getClosedTrades = (trades: Trade[]) => {
  return trades
    .map((trade) => {
      return {
        ...trade,
        close_date: new Date(trade.close_date.toDateString())
      };
    });
};

const getUniqueCloseDates = (trades: Trade[]): Date[] => {
  return trades
    .map((t) => t.close_date.getTime())
    .filter((s, i, a) => a.indexOf(s) === i)
    .map((s) => new Date(s));
};

const groupTradesByCloseDate = (trades: Trade[], closeDates: Date[]): { close_date: Date, trades: Trade[] }[] => {
  return closeDates
    .map((close_date) => {
      return {
        close_date,
        trades: trades.filter((trade) => trade.close_date.getTime() === close_date.getTime())
      };
    })
    .sort((a, b) => a.close_date.getTime() - b.close_date.getTime());
};

const getStatsHistory = (groupedTrades, startingBalance: number, risk: number) => {
  let history = [];

  for (let currentDate = 0; currentDate < groupedTrades.length; ++currentDate) {
    let slice = [];

    for (let i = 0; i <= currentDate; ++i) {
      slice = [...slice, ...groupedTrades[i].trades];
    }

    const date = groupedTrades[currentDate].close_date;

    const snapshot = {
      date,
      stats: calculateStats(startingBalance, risk, date, slice)
    };

    history = [...history, snapshot];
  }

  return history;
};

const getStartingSnapshot = (history: StatsSnapshot[], startingBalance: number): StatsSnapshot => {
  return {
    date: new Date(new Date(history[0].date).setDate(history[0].date.getDate() - 1)),
    stats: {
      startingBalance,
      currentBalance: startingBalance,
      netProfit: 0,
      netProfitPercent: 0,
      annualizedProfitPercent: 0,
      grossProfit: 0,
      grossLoss: 0,
      profitFactor: 1,
      alpha: 0,
      sharpeRatio: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      evenTrades: 0,
      percentProfitable: 0,
      averageGain: 0,
      averageLoss: 0,
      gainLossRatio: 1,
      averageProfitLoss: 0,
      averageReturnOnRisk: 0,
      tradingPeriodDays: 0,
      averageDurationDays: 0,
      kellyPercentage: 0,
      riskPerTrade: 0
    }
  };
};

const getZeroedStats = (history: StatsSnapshot[]) => {
  return {
    ...history[history.length - 1].stats,
    long: {
      netProfit: 0,
      netProfitPercent: 0,
      grossProfit: 0,
      grossLoss: 0,
      profitFactor: 0,
      percentProfitable: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      evenTrades: 0,
      averageProfitLoss: 0,
      averageGain: 0,
      averageLoss: 0,
      gainLossRatio: 0,
      averageDurationDays: 0
    },
    short: {
      netProfit: 0,
      netProfitPercent: 0,
      grossProfit: 0,
      grossLoss: 0,
      profitFactor: 0,
      percentProfitable: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      evenTrades: 0,
      averageProfitLoss: 0,
      averageGain: 0,
      averageLoss: 0,
      gainLossRatio: 0,
      averageDurationDays: 0
    },
    neutral: {
      netProfit: 0,
      netProfitPercent: 0,
      grossProfit: 0,
      grossLoss: 0,
      profitFactor: 0,
      percentProfitable: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      evenTrades: 0,
      averageProfitLoss: 0,
      averageGain: 0,
      averageLoss: 0,
      gainLossRatio: 0,
      averageDurationDays: 0
    }
  };
};

const getSideStats = (trades: Trade[], startingBalance: number) => {
  if (trades.length === 0) {
    return {
      netProfit: 0,
      netProfitPercent: 0,
      grossProfit: 0,
      grossLoss: 0,
      profitFactor: 0,
      percentProfitable: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      evenTrades: 0,
      averageProfitLoss: 0,
      averageGain: 0,
      averageLoss: 0,
      gainLossRatio: 0,
      averageDurationDays: 0
    };
  }

  const winningTrades = getWinningTrades(trades);
  const losingTrades = getLosingTrades(trades);
  const evenTrades = getEvenTrades(trades);
  const grossProfit = getGrossProfit(winningTrades);
  const grossLoss = -getGrossProfit(losingTrades);
  const netProfit = getNetProfit(trades);
  const netProfitPercent = netProfit / startingBalance;
  const profitFactor = getProfitLossFactor(grossProfit, grossLoss);
  const percentProfitable = getPercentProfitable(winningTrades.length, losingTrades.length);
  const averageGain = getAverageProfit(winningTrades);
  const averageLoss = getAverageProfit(losingTrades);
  const gainLossRatio = averageGain && averageLoss ? averageGain / averageLoss : 1;
  const averageProfitLoss = netProfit / (winningTrades.length + losingTrades.length);
  const averageDurationDays = _.mean(trades
    .filter((trade) => trade.close_date)
    .map((trade) => getTradeDurationDays(trade)));

  return {
    netProfit: netProfit,
    netProfitPercent: netProfitPercent,
    grossProfit: grossProfit,
    grossLoss: -grossLoss,
    profitFactor: profitFactor,
    percentProfitable: percentProfitable,
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    evenTrades: evenTrades.length,
    averageProfitLoss: averageProfitLoss,
    averageGain: averageGain,
    averageLoss: averageLoss,
    gainLossRatio: gainLossRatio,
    averageDurationDays: averageDurationDays
  };
};

const insertStartingSnapshot = (history: StatsSnapshot[], closedTrades: Trade[], startingBalance: number): StatsSnapshot[] => {
  const startingSnapshot = getStartingSnapshot(history, startingBalance);
  history = [startingSnapshot, ...history];

  const longTrades = closedTrades.filter((trade) => getTradeDirection(trade) === TradeDirection.Long);
  const shortTrades = closedTrades.filter((trade) => getTradeDirection(trade) === TradeDirection.Short);
  const neutralTrades = closedTrades.filter((trade) => getTradeDirection(trade) === TradeDirection.Neutral);

  history[history.length - 1].stats = {
    ...getZeroedStats(history),
    long: getSideStats(longTrades, startingBalance),
    short: getSideStats(shortTrades, startingBalance),
    neutral: getSideStats(neutralTrades, startingBalance)
  };

  return history;
};

export const calculateStatsHistory = (startingBalance: number, risk: number, trades: Trade[]): StatsSnapshot[] => {
  const closedTrades = getClosedTrades(trades);
  const closeDates = getUniqueCloseDates(trades);
  const groupedTrades = groupTradesByCloseDate(closedTrades, closeDates);

  let history: StatsSnapshot[] = getStatsHistory(groupedTrades, startingBalance, risk);
  history = insertStartingSnapshot(history, closedTrades, startingBalance);

  return history;
};

export interface StatsBundle {
  startingBalance: number;
  currentBalance: number;
  netProfit: number;
  netProfitPercent: number;
  annualizedProfitPercent: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  alpha: number;
  sharpeRatio: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  evenTrades: number;
  percentProfitable: number;
  averageGain: number;
  averageLoss: number;
  gainLossRatio: number;
  averageProfitLoss: number;
  averageReturnOnRisk: number;
  tradingPeriodDays: number;
  averageDurationDays: number;
  kellyPercentage: number;
  riskPerTrade: number;
  long?: {
    netProfit: number;
    netProfitPercent: number;
    grossProfit: number;
    grossLoss: number;
    profitFactor: number;
    percentProfitable: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    evenTrades: number;
    averageProfitLoss: number;
    averageGain: number;
    averageLoss: number;
    gainLossRatio: number;
    averageDurationDays: number;
  };
  short?: {
    netProfit: number;
    netProfitPercent: number;
    grossProfit: number;
    grossLoss: number;
    profitFactor: number;
    percentProfitable: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    evenTrades: number;
    averageProfitLoss: number;
    averageGain: number;
    averageLoss: number;
    gainLossRatio: number;
    averageDurationDays: number;
  };
  neutral?: {
    netProfit: number;
    netProfitPercent: number;
    grossProfit: number;
    grossLoss: number;
    profitFactor: number;
    percentProfitable: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    evenTrades: number;
    averageProfitLoss: number;
    averageGain: number;
    averageLoss: number;
    gainLossRatio: number;
    averageDurationDays: number;
  };
}

export const calculateStats = (startingBalance: number, risk: number, date: Date, trades: Trade[]): StatsBundle => {
  const winningTrades = getWinningTrades(trades);
  const losingTrades = getLosingTrades(trades);
  const evenTrades = getEvenTrades(trades);
  const grossProfit = getGrossProfit(winningTrades);
  const grossLoss = -getGrossProfit(losingTrades);
  const netProfit = getNetProfit(trades);
  const netProfitPercent = netProfit / startingBalance;
  const currentBalance = startingBalance + netProfit;
  const annualizedProfitPercent = getAnnualizedProfit(startingBalance, netProfit, trades);
  const profitFactor = getProfitLossFactor(grossProfit, grossLoss);
  const alpha = getAlpha(trades, date, startingBalance);
  const sharpeRatio = getSharpeRatio(trades, startingBalance);
  const percentProfitable = getPercentProfitable(winningTrades.length, losingTrades.length);
  const averageGain = getAverageProfit(winningTrades);
  const averageLoss = getAverageProfit(losingTrades);
  const gainLossRatio = averageGain && averageLoss ? averageGain / averageLoss : 1;
  const averageProfitLoss = netProfit / (winningTrades.length + losingTrades.length);
  const averageReturnOnRisk = _.mean(trades
    .map((trade) => getReturnOnRisk(trade))
    .filter((r) => isFinite(r)));
  const tradingPeriodDays = getTradingPeriodDays(trades);
  const averageDurationDays = _.mean(trades
    .filter((trade) => trade.close_date)
    .map((trade) => getTradeDurationDays(trade)));
  const kellyPercentage = getKellyPercentage(percentProfitable, averageGain, averageLoss);
  const riskAmount = risk != null ? currentBalance * risk / 100 : undefined;

  return {
    startingBalance,
    currentBalance,
    netProfit,
    netProfitPercent,
    annualizedProfitPercent,
    grossProfit,
    grossLoss,
    profitFactor,
    alpha,
    sharpeRatio,
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    evenTrades: evenTrades.length,
    percentProfitable,
    averageGain,
    averageLoss,
    gainLossRatio,
    averageProfitLoss,
    averageReturnOnRisk,
    tradingPeriodDays,
    averageDurationDays,
    kellyPercentage,
    riskPerTrade: riskAmount
  };
};