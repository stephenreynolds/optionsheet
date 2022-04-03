import { getProfitLoss, getTradeDurationDays, treasury10Y } from "../../../common/tradeUtils";
import { Trade } from "../../../common/models/trade";
import { std } from "mathjs";
import _ from "lodash";

export const getWinningTrades = (trades: Trade[]): Trade[] => {
  return trades.filter((trade) => getProfitLoss(trade) > 0);
};

export const getLosingTrades = (trades: Trade[]): Trade[] => {
  return trades.filter((trade) => getProfitLoss(trade) < 0);
};

export const getEvenTrades = (trades: Trade[]): Trade[] => {
  return trades.filter((trade) => getProfitLoss(trade) === 0);
};

const sumNumbers = (nums: number[]): number => {
  return Number(nums.reduce((a, b) => a + b, 0));
};

export const getGrossProfit = (trades: Trade[]): number => {
  const profits = trades.map((trade) => getProfitLoss(trade));

  return sumNumbers(profits);
};

export const getNetProfit = (trades: Trade[]): number => {
  const winningTrades = getWinningTrades(trades);
  const losingTrades = getLosingTrades(trades);
  const grossProfit = getGrossProfit(winningTrades);
  const grossLoss = -getGrossProfit(losingTrades);

  return grossProfit - grossLoss;
};

const getExcessReturns = (trades: Trade[], startingBalance: number): number[] => {
  let balance = startingBalance;
  let excessReturns = [];
  
  for (const trade of trades) {
    const profit = getProfitLoss(trade);
    const profitPercent = profit / balance;
    const excessReturn = profitPercent - (treasury10Y / 365) * getTradeDurationDays(trade);
    excessReturns = [...excessReturns, excessReturn];
    balance += profit;
  }

  return excessReturns;
};

const getRiskFreeRate = (treasuryYield: number, days: number) => {
  return (treasury10Y / 365) * days;
};

export const getSharpeRatio = (trades: Trade[], startingBalance: number): number => {
  const closedTrades = trades.slice().sort((a, b) => {
    return a.close_date.getTime() - b.close_date.getTime();
  });

  // Calculate excess returns
  const excessReturns = getExcessReturns(closedTrades, startingBalance)

  // Portfolio return
  const currentBalance = startingBalance + getNetProfit(closedTrades);
  const portfolioReturn = (currentBalance - startingBalance) / startingBalance;

  // Risk-free rate
  const days = getTradingPeriodDays(closedTrades);
  const riskFreeRate = getRiskFreeRate(treasury10Y, days);

  return (portfolioReturn - riskFreeRate) / std(...excessReturns);
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

  const balanceOneYearAgo = grossProfit1 - grossLoss1 + startingBalance;

  // Calculate net profit since one year ago.
  const pastTrades = trades.filter((trade) => trade.close_date.getTime() >= lastYear.getTime());
  const winningTrades = getWinningTrades(pastTrades);
  const losingTrades = getLosingTrades(pastTrades);
  const grossProfit = getGrossProfit(winningTrades);
  const grossLoss = -getGrossProfit(losingTrades);

  const netProfit = grossProfit - grossLoss;
  const netProfitPercent = netProfit / balanceOneYearAgo;

  // Return alpha.
  return netProfitPercent - marketPerformance;
};
