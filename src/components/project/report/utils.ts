import _ from "lodash";
import { std } from "mathjs";
import { Trade } from "../../../common/models/trade";
import { TradeDirection, getTradeDirection } from "../../../common/strategy";
import { getProfitLoss, getReturnOnRisk, getTradeDurationDays, treasury10Y } from "../../../common/tradeUtils";

export type AnalyticsSnapshot = {
  date: Date,
  analytics: AnalyticsBundle
};

export const calculateAnalyticsHistory = (startingBalance: number, risk: number, trades: Trade[]): AnalyticsSnapshot[] => {
  const closedTrades = trades
    .map((trade) => {
      return {
        ...trade,
        close: new Date(trade.close_date.toDateString())
      };
    });

  // Group and sort trades by close date.
  const closeDates = closedTrades
    .map((t) => t.close.getTime())
    .filter((s, i, a) => a.indexOf(s) === i)
    .map((s) => new Date(s));

  const groupedTrades = closeDates
    .map((close) => {
      return {
        close,
        trades: closedTrades.filter((trade) => trade.close.getTime() === close.getTime())
      };
    })
    .sort((a, b) => a.close.getTime() - b.close.getTime());

  // Get report up to each date.
  let history: AnalyticsSnapshot[] = [];

  for (let currentDate = 0; currentDate < groupedTrades.length; ++currentDate) {
    let slice = [];

    for (let i = 0; i <= currentDate; ++i) {
      slice = [...slice, ...groupedTrades[i].trades];
    }

    const date = groupedTrades[currentDate].close;

    const snapshot = {
      date,
      analytics: calculateAnalytics(startingBalance, risk, date, slice)
    };

    history = [...history, snapshot];
  }

  const startingSnapshot = {
    date: new Date(new Date(history[0].date).setDate(history[0].date.getDate() - 1)),
    analytics: {
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

  history = [startingSnapshot, ...history];

  history[history.length - 1].analytics = {
    ...history[history.length - 1].analytics,
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

  // Long trades
  const longTrades = closedTrades.filter((trade) => getTradeDirection(trade) === TradeDirection.Long);
  if (longTrades.length > 0) {
    const winningTradesLong = getWinningTrades(longTrades);
    const losingTradesLong = getLosingTrades(longTrades);
    const evenTradesLong = getEvenTrades(longTrades);
    const grossProfitLong = getGrossProfit(winningTradesLong);
    const grossLossLong = -getGrossProfit(losingTradesLong);
    const netProfitLong = getNetProfit(grossProfitLong, grossLossLong);
    const netProfitPercentLong = netProfitLong / startingBalance;
    const profitFactorLong = getProfitLossFactor(grossProfitLong, grossLossLong);
    const percentProfitableLong = getPercentProfitable(winningTradesLong.length, losingTradesLong.length);
    const averageGainLong = getAverageProfit(winningTradesLong);
    const averageLossLong = getAverageProfit(losingTradesLong);
    const gainLossRatioLong = averageGainLong && averageLossLong ? averageGainLong / averageLossLong : 1;
    const averageProfitLossLong = netProfitLong / (winningTradesLong.length + losingTradesLong.length);
    const averageDurationDaysLong = _.mean(longTrades
      .filter((trade) => trade.close_date)
      .map((trade) => getTradeDurationDays(trade)));

    history[history.length - 1].analytics.long = {
      netProfit: netProfitLong,
      netProfitPercent: netProfitPercentLong,
      grossProfit: grossProfitLong,
      grossLoss: grossLossLong,
      profitFactor: profitFactorLong,
      percentProfitable: percentProfitableLong,
      totalTrades: longTrades.length,
      winningTrades: winningTradesLong.length,
      losingTrades: losingTradesLong.length,
      evenTrades: evenTradesLong.length,
      averageProfitLoss: averageProfitLossLong,
      averageGain: averageGainLong,
      averageLoss: averageLossLong,
      gainLossRatio: gainLossRatioLong,
      averageDurationDays: averageDurationDaysLong
    };
  }

  // Short trades
  const shortTrades = closedTrades.filter((trade) => getTradeDirection(trade) === TradeDirection.Short);
  if (shortTrades.length > 0) {
    const winningTradesShort = getWinningTrades(shortTrades);
    const losingTradesShort = getLosingTrades(shortTrades);
    const evenTradesShort = getEvenTrades(shortTrades);
    const grossProfitShort = getGrossProfit(winningTradesShort);
    const grossLossShort = -getGrossProfit(losingTradesShort);
    const netProfitShort = getNetProfit(grossProfitShort, grossLossShort);
    const netProfitPercentShort = netProfitShort / startingBalance;
    const profitFactorShort = getProfitLossFactor(grossProfitShort, grossLossShort);
    const percentProfitableShort = getPercentProfitable(winningTradesShort.length, losingTradesShort.length);
    const averageGainShort = getAverageProfit(winningTradesShort);
    const averageLossShort = getAverageProfit(losingTradesShort);
    const gainLossRatioShort = averageGainShort && averageLossShort ? averageGainShort / averageLossShort : 1;
    const averageProfitLossShort = netProfitShort / (winningTradesShort.length + losingTradesShort.length);
    const averageDurationDaysShort = _.mean(shortTrades
      .filter((trade) => trade.close_date)
      .map((trade) => getTradeDurationDays(trade)));

    history[history.length - 1].analytics.short = {
      netProfit: netProfitShort,
      netProfitPercent: netProfitPercentShort,
      grossProfit: grossProfitShort,
      grossLoss: grossLossShort,
      profitFactor: profitFactorShort,
      percentProfitable: percentProfitableShort,
      totalTrades: shortTrades.length,
      winningTrades: winningTradesShort.length,
      losingTrades: losingTradesShort.length,
      evenTrades: evenTradesShort.length,
      averageProfitLoss: averageProfitLossShort,
      averageGain: averageGainShort,
      averageLoss: averageLossShort,
      gainLossRatio: gainLossRatioShort,
      averageDurationDays: averageDurationDaysShort
    };
  }

  // Neutral trades
  const neutralTrades = closedTrades.filter((trade) => getTradeDirection(trade) === TradeDirection.Neutral);
  if (neutralTrades.length > 0) {
    const winningTradesNeutral = getWinningTrades(neutralTrades);
    const losingTradesNeutral = getLosingTrades(neutralTrades);
    const evenTradesNeutral = getEvenTrades(neutralTrades);
    const grossProfitNeutral = getGrossProfit(winningTradesNeutral);
    const grossLossNeutral = -getGrossProfit(losingTradesNeutral);
    const netProfitNeutral = getNetProfit(grossProfitNeutral, grossLossNeutral);
    const netProfitPercentNeutral = netProfitNeutral / startingBalance;
    const profitFactorNeutral = getProfitLossFactor(grossProfitNeutral, grossLossNeutral);
    const percentProfitableNeutral = getPercentProfitable(winningTradesNeutral.length, losingTradesNeutral.length);
    const averageGainNeutral = getAverageProfit(winningTradesNeutral);
    const averageLossNeutral = getAverageProfit(losingTradesNeutral);
    const gainLossRatioNeutral = averageGainNeutral && averageLossNeutral ? averageGainNeutral / averageLossNeutral : 1;
    const averageProfitLossNeutral = netProfitNeutral / (winningTradesNeutral.length + losingTradesNeutral.length);
    const averageDurationDaysNeutral = _.mean(neutralTrades
      .filter((trade) => trade.close_date)
      .map((trade) => getTradeDurationDays(trade)));

    history[history.length - 1].analytics.neutral = {
      netProfit: netProfitNeutral,
      netProfitPercent: netProfitPercentNeutral,
      grossProfit: grossProfitNeutral,
      grossLoss: grossLossNeutral,
      profitFactor: profitFactorNeutral,
      percentProfitable: percentProfitableNeutral,
      totalTrades: neutralTrades.length,
      winningTrades: winningTradesNeutral.length,
      losingTrades: losingTradesNeutral.length,
      evenTrades: evenTradesNeutral.length,
      averageProfitLoss: averageProfitLossNeutral,
      averageGain: averageGainNeutral,
      averageLoss: averageLossNeutral,
      gainLossRatio: gainLossRatioNeutral,
      averageDurationDays: averageDurationDaysNeutral
    };
  }

  return history;
};

export interface AnalyticsBundle {
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

export const calculateAnalytics = (startingBalance: number, risk: number, date: Date, trades: Trade[]): AnalyticsBundle => {
  const winningTrades = getWinningTrades(trades);
  const losingTrades = getLosingTrades(trades);
  const evenTrades = getEvenTrades(trades);
  const grossProfit = getGrossProfit(winningTrades);
  const grossLoss = -getGrossProfit(losingTrades);
  const netProfit = getNetProfit(grossProfit, grossLoss);
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

const sumNumbers = (nums: number[]): number => {
  return Number(nums.reduce((a, b) => a + b, 0));
};

export const getWinningTrades = (trades: Trade[]): Trade[] => {
  return trades.filter((trade) => getProfitLoss(trade) > 0);
};

export const getLosingTrades = (trades: Trade[]): Trade[] => {
  return trades.filter((trade) => getProfitLoss(trade) < 0);
};

export const getEvenTrades = (trades: Trade[]): Trade[] => {
  return trades.filter((trade) => getProfitLoss(trade) === 0);
};

export const getGrossProfit = (trades: Trade[]): number => {
  const profits = trades.map((trade) => getProfitLoss(trade));

  return sumNumbers(profits);
};

export const getNetProfit = (grossProfit: number, grossLoss: number): number => {
  return grossProfit - grossLoss;
};

export const getProfitLossFactor = (grossProfit: number, grossLoss: number): number => {
  if (grossLoss === 0) {
    return 1;
  }

  return grossProfit / grossLoss;
};

export const getPercentProfitable = (winners: number, losers: number): number => {
  return winners / (winners + losers);
};

export const getAverageProfit = (trades: Trade[]): number => {
  const profits = trades.map((trade) => getProfitLoss(trade));
  return profits.length ? Math.abs(_.mean(profits)) : 0;
};

export const getTradingPeriodDays = (trades: Trade[]): number => {
  const diff = trades[trades.length - 1].close_date.getTime() - trades[0].open_date.getTime();
  return diff / (1000 * 3600 * 24);
};

export const getSharpeRatio = (trades: Trade[], startingBalance: number): number => {
  const closedTrades = trades.slice().sort((a, b) => {
    return a.close_date.getTime() - b.close_date.getTime();
  });

  // Calculate excess returns
  let currentBalance = startingBalance;
  let excessReturns = [];
  for (const trade of closedTrades) {
    const profit = getProfitLoss(trade);
    const profitPercent = profit / currentBalance;
    const excessReturn = profitPercent - (treasury10Y / 365) * getTradeDurationDays(trade);
    excessReturns = [...excessReturns, excessReturn];
    currentBalance += profit;
  }

  // Portfolio return
  const portfolioReturn = (currentBalance - startingBalance) / startingBalance;

  // Risk-free rate
  const days = getTradingPeriodDays(closedTrades);
  const riskFreeRate = (treasury10Y / 365) * days;

  return (portfolioReturn - riskFreeRate) / std(...excessReturns);
};

export const getKellyPercentage = (percentProfitable: number, averageGain: number, averageLoss: number): number => {
  return percentProfitable - (1 - percentProfitable) / (averageGain / averageLoss);
};

export const getAnnualizedProfit = (startingBalance: number, netProfit: number, trades: Trade[]): number => {
  const openDates = trades.map((t) => t.open_date);
  const closeDates = trades.map((t) => t.close_date);

  const maxClose = new Date(Math.max.apply(null, closeDates)).getTime() / (1000 * 3600 * 24);
  const minOpen = new Date(Math.min.apply(null, openDates)).getTime() / (1000 * 3600 * 24);

  return Math.pow(((startingBalance + netProfit) / startingBalance), (365 / Number(maxClose - minOpen))) - 1;
};

// TODO: Update average annual market return daily using public API
export const getAlpha = (trades: Trade[], date: Date, startingBalance: number, marketPerformance = 0.094) => {
  const lastYear = new Date(date);
  lastYear.setFullYear(lastYear.getFullYear() - 1);

  // Calculate balance one year ago.
  const pastTrades1 = trades.filter((trade) => trade.close_date.getTime() <= lastYear.getTime());
  const winningTrades1 = getWinningTrades(pastTrades1);
  const losingTrades1 = getLosingTrades(pastTrades1);
  const grossProfit1 = getGrossProfit(winningTrades1);
  const grossLoss1 = -getGrossProfit(losingTrades1);

  const balanceOneYearAgo = getNetProfit(grossProfit1, grossLoss1) + startingBalance;

  // Calculate net profit since one year ago.
  const pastTrades = trades.filter((trade) => trade.close_date.getTime() >= lastYear.getTime());
  const winningTrades = getWinningTrades(pastTrades);
  const losingTrades = getLosingTrades(pastTrades);
  const grossProfit = getGrossProfit(winningTrades);
  const grossLoss = -getGrossProfit(losingTrades);

  const netProfit = getNetProfit(grossProfit, grossLoss);
  const netProfitPercent = netProfit / balanceOneYearAgo;

  // Return alpha.
  return netProfitPercent - marketPerformance;
};
