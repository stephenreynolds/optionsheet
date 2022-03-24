import { Leg, PutCall, Side, Trade } from "./models/trade";
import { getStrategyFromLegs, Strategy } from "./strategy";
import _ from "lodash";
import numeral from "numeral";

export const getTradeQuantity = (legs: Leg[]) => {
  if (!legs.length) {
    return 0;
  }

  const quantities = legs.map(l => l.quantity);
  return Math.min(...quantities);
};

export const getFirstExpiration = (legs: Leg[]) => {
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

export const formatPrice = (price: number, digits = 2) => {
  if (isNaN(price)) {
    return "--";
  }
  if (!isFinite(price)) {
    return "Unlimited";
  }

  return numeral(price).format(`$0,0.${"0".repeat(digits)}`);
};

export const tradeIsOption = (legs: Leg[]) => {
  return _.every(legs, (leg) => leg.put_call && leg.strike >= 0 && leg.expiration);
};

export const getNetCost = (legs: Leg[]) => {
  let sum = 0;

  for (const { side, open_price, quantity } of legs) {
    const s = side === Side.Buy ? 1 : -1;
    sum += s * open_price * quantity;
  }

  return sum;
};

export const getOpenPrice = (legs: Leg[]) => {
  let sum = 0;

  for (const { side, open_price } of legs) {
    const s = side === Side.Buy ? 1 : -1;
    sum += s * open_price;
  }

  return sum;
};

export const getProfitLoss = ({ close_date, legs }: Trade) => {
  if (!close_date) {
    return NaN;
  }

  let sum = 0;

  for (const { side, open_price, close_price, quantity } of legs) {
    if (side == Side.Buy) {
      sum += (close_price - open_price) * quantity;
    }
    else {
      sum += (open_price - close_price) * quantity;
    }
  }

  if (tradeIsOption(legs)) {
    return sum * 100;
  }

  return sum;
};

export const formatDate = (date: Date) => {
  return date ? date.toLocaleDateString() : "";
};

export const getMaxProfit = (trade: Trade) => {
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

export const getMaxLoss = (trade: Trade) => {
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
    const calls = legs.filter((leg) => leg.put_call === PutCall.Call);
    const puts = legs.filter((leg) => leg.put_call === PutCall.Put);
    const callsDiff = Math.abs(calls[0].strike - calls[1].strike);
    const putsDiff = Math.abs(puts[0].strike - puts[1].strike);
    return callsDiff > putsDiff ? callsDiff + cost : putsDiff + cost;
  }

  return undefined;
};

export const getReturnOnRisk = (trade: Trade) => {
  const maxProfit = getMaxProfit(trade);
  const maxLoss = getMaxLoss(trade);

  if (!(isFinite(maxProfit) && isFinite(maxLoss))) {
    return undefined;
  }

  return Math.abs(maxProfit / maxLoss);
};

export const getTradeDurationDays = (trade: Trade) => {
  const diff = trade.close_date.getTime() - trade.open_date.getTime();
  return Math.floor((diff / (1000 * 3600 * 24)));
};

export const getDaysToExpiration = (openDate: Date, leg: Leg) => {
  const diff = leg.expiration.getTime() - openDate.getTime();
  return Math.floor((diff / (1000 * 3600 * 24)));
};

export const treasury10Y = 0.02; // TODO: Update $TNX daily with a public API

export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});