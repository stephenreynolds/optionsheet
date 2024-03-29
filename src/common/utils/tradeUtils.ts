import { Leg, PutCall, Side, Trade } from "../models/trade";
import { getStrategyFromLegs, Strategy } from "./strategy";
import _ from "lodash";
import numeral from "numeral";

export const getTradeQuantity = (legs: Leg[]): number => {
  if (!legs.length) {
    return 0;
  }

  const quantities = legs.map(l => l.quantity);
  return Math.min(...quantities);
};

export const getFirstExpiration = (legs: Leg[]): Date => {
  if (!legs.length) {
    return undefined;
  }

  const invalidLegs = legs.find((leg) => !leg.expiration);
  if (invalidLegs) {
    return undefined;
  }

  const optionLegs = legs.filter((leg) => leg.expiration);
  const expirations = optionLegs.map((l) => l.expiration.getTime());

  return new Date(expirations.sort((a, b) => a - b)[0]);
};

export const formatPrice = (price: number, digits = 2): string => {
  if (isNaN(price)) {
    return "--";
  }
  if (!isFinite(price)) {
    return "Unlimited";
  }

  return numeral(price).format(`$0,0.${"0".repeat(digits)}`);
};

export const tradeIsOption = (legs: Leg[]): boolean => {
  return _.every(legs, (leg) => leg.putCall && leg.strike >= 0 && leg.expiration);
};

export const getNetCost = (legs: Leg[]): number => {
  let sum = 0;

  for (const { side, openPrice, quantity } of legs) {
    const s = side === Side.Buy ? 1 : -1;
    sum += s * openPrice * quantity;
  }

  return sum;
};

export const getOpenPrice = (legs: Leg[]): number => {
  let sum = 0;

  for (const { side, openPrice } of legs) {
    const s = side === Side.Buy ? 1 : -1;
    sum += s * openPrice;
  }

  return sum;
};

export const getProfitLoss = ({ closeDate, legs }: Trade): number => {
  if (!closeDate) {
    return NaN;
  }

  let sum = 0;

  for (const { side, openPrice, closePrice, quantity } of legs) {
    if (side == Side.Buy) {
      sum += (closePrice - openPrice) * quantity;
    }
    else {
      sum += (openPrice - closePrice) * quantity;
    }
  }

  if (tradeIsOption(legs)) {
    return sum * 100;
  }

  return sum;
};

export const formatDate = (date: Date): string => {
  return date ? date.toLocaleDateString() : "";
};

export const getMaxProfit = (trade: Trade): number => {
  const legs = trade.legs;
  const cost = getOpenPrice(legs);
  const strategy = getStrategyFromLegs(legs);

  if (strategy === Strategy.ShortShares) {
    return -cost * legs[0].quantity;
  }

  // Max profit of a credit spread is the net credit.
  if (cost < 0) {
    return Math.abs(cost);
  }

  // Long call, strangle, straddle = unlimited
  if (strategy === Strategy.LongShares ||
    strategy === Strategy.LongCall ||
    strategy === Strategy.Strangle ||
    strategy === Strategy.Straddle) {
    return Infinity;
  }
  // Long put = strike - net debit
  if (strategy === Strategy.LongPut) {
    return legs[0].strike - cost;
  }
  // Long vertical = difference in strikes - net debit
  if (strategy === Strategy.LongCallVertical || strategy === Strategy.LongPutVertical ||
    strategy === Strategy.LongCallDiagonal || strategy === Strategy.LongPutDiagonal) {
    const diff = Math.abs(legs[0].strike - legs[1].strike);
    return diff - cost;
  }

  return undefined;
};

export const getMaxLoss = (trade: Trade): number => {
  const legs = trade.legs;
  const cost = getOpenPrice(legs);
  const strategy = getStrategyFromLegs(legs);

  if (strategy === Strategy.LongShares) {
    return cost * legs[0].quantity;
  }

  if (strategy === Strategy.ShortShares) {
    return Infinity;
  }

  // Max loss of a debit spread is the net debit.
  if (cost > 0) {
    return cost;
  }

  // Short call, strangle, straddle = unlimited
  if (strategy === Strategy.ShortCall ||
    strategy === Strategy.Strangle ||
    strategy === Strategy.Straddle) {
    return undefined;
  }
  // Short put = strike - net credit
  if (strategy === Strategy.ShortPut) {
    return legs[0].strike + cost;
  }
  // Short vertical = difference in strikes - net credit
  if (strategy === Strategy.ShortCallVertical || strategy === Strategy.ShortPutVertical) {
    const diff = Math.abs(legs[0].strike - legs[1].strike);
    return diff + cost;
  }
  // Iron condor = difference in strikes - net credit of the widest side
  if (strategy === Strategy.IronCondor) {
    const calls = legs.filter((leg) => leg.putCall === PutCall.Call);
    const puts = legs.filter((leg) => leg.putCall === PutCall.Put);
    const callsDiff = Math.abs(calls[0].strike - calls[1].strike);
    const putsDiff = Math.abs(puts[0].strike - puts[1].strike);
    return callsDiff > putsDiff ? callsDiff + cost : putsDiff + cost;
  }

  return undefined;
};

export const getReturnOnRisk = (trade: Trade): number => {
  const maxProfit = getMaxProfit(trade);
  const maxLoss = getMaxLoss(trade);

  if (!(isFinite(maxProfit) && isFinite(maxLoss))) {
    return undefined;
  }

  return Math.abs(maxProfit / maxLoss);
};

export const getTradeDurationDays = (trade: Trade): number => {
  const diff = trade.closeDate.getTime() - trade.openDate.getTime();
  return Math.floor((diff / (1000 * 3600 * 24)));
};

export const treasury10Y = 0.02; // TODO: Update $TNX daily with a public API

export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});