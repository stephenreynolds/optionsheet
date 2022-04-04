import { Leg, PutCall, Side, Trade } from "./models/trade";
import _ from "lodash";
import { tradeIsOption } from "./tradeUtils";

export enum Strategy {
  Custom = "Custom",
  LongShares = "Long Shares",
  ShortShares = "Short Shares",
  LongCall = "Long Call",
  LongPut = "Long Put",
  ShortCall = "Short Call",
  ShortPut = "Short Put",
  LongCallVertical = "Long Call Vertical",
  LongPutVertical = "Long Put Vertical",
  ShortCallVertical = "Short Call Vertical",
  ShortPutVertical = "Short Put Vertical",
  IronCondor = "Iron Condor",
  Calendar = "Calendar",
  LongCallDiagonal = "Long Call Diagonal",
  LongPutDiagonal = "Long Put Diagonal",
  ShortCallDiagonal = "Short Call Diagonal",
  ShortPutDiagonal = "Short Put Diagonal",
  Butterfly = "Butterfly",
  DoubleDiagonal = "Double Diagonal",
  Strangle = "Strangle",
  Straddle = "Straddle"
}

const sameExpiration = (legs: Leg[]): boolean => {
  return legs.map(l => new Date(l.expiration).getTime()).every((val, i, arr) => val === arr[0]);
};

const sameOptionType = (legs: Leg[]): boolean => {
  return legs.map(l => l.putCall).every((val, i, arr) => val === arr[0]);
};

const getLowestQuantity = (legs: Leg[]): number => {
  const quantities = legs.map(l => l.quantity);
  return Math.min(...quantities);
};

const getLowestExpiration = (legs: Leg[]): Date => {
  return legs
    .map(l => l.expiration)
    .sort((a, b) => a.getTime() - b.getTime())[0];
};

export const getStrategyFromLegs = (legs: Leg[]): Strategy => {
  if (!tradeIsOption(legs)) {
    return legs[0].side === Side.Buy ? Strategy.LongShares : Strategy.ShortShares;
  }

  // Single leg option
  if (legs.length === 1) {
    const l = legs[0];
    if (l.putCall === PutCall.Call) {
      if (l.side === Side.Buy) {
        return Strategy.LongCall;
      }
      return Strategy.ShortCall;
    }
    else {
      if (l.side === Side.Buy) {
        return Strategy.LongPut;
      }
      return Strategy.ShortPut;
    }
  }

  // Two legs
  if (legs.length === 2) {
    if (sameOptionType(legs)) {
      if (legs[0].side !== legs[1].side) {
        if (sameExpiration(legs)) {
          if (legs[0].putCall === PutCall.Call) {
            if (legs[0].side === Side.Buy && legs[0].strike < legs[1].strike) {
              return Strategy.LongCallVertical;
            }
            else {
              return Strategy.ShortCallVertical;
            }
          }
          else {
            if (legs[0].side === Side.Buy && legs[0].strike < legs[1].strike) {
              return Strategy.LongPutVertical;
            }
            else {
              return Strategy.ShortPutVertical;
            }
          }
        }

        if (legs[0].strike === legs[1].strike) {
          return Strategy.Calendar;
        }

        if (legs[0].putCall === PutCall.Call) {
          if (legs[0].side === Side.Buy && legs[0].strike < legs[1].strike ||
              legs[1].side === Side.Buy && legs[1].strike < legs[0].strike) {
            return Strategy.LongCallDiagonal;
          }
          else {
            return Strategy.ShortCallDiagonal;
          }
        }
        else {
          if (legs[0].side === Side.Buy && legs[0].strike > legs[1].strike ||
            legs[1].side === Side.Buy && legs[1].strike > legs[0].strike) {
            return Strategy.LongPutDiagonal;
          }
          else {
            return Strategy.ShortPutDiagonal;
          }
        }
      }
    }

    if (legs[0].side === legs[1].side) {
      if (sameExpiration(legs)) {
        if (legs[0].strike === legs[1].strike) {
          return Strategy.Straddle;
        }

        return Strategy.Strangle;
      }
    }
  }

  // Three legs
  if (legs.length === 3) {
    if (sameExpiration(legs)) {
      if (sameOptionType(legs)) {
        const lowestQty = getLowestQuantity(legs);
        const lowest = legs.filter(l => l.quantity === lowestQty);
        const higher = legs.filter(l => l.quantity > lowestQty)[0];
        if (lowest.length === 2 && higher.side !== lowest[0].side) {
          return Strategy.Butterfly;
        }
      }
    }
  }

  // Four legs
  if (legs.length === 4) {
    if (sameExpiration(legs)) {
      if (_.find(legs, l => l.putCall === PutCall.Put && l.side === Side.Sell) &&
        _.find(legs, l => l.putCall === PutCall.Call && l.side === Side.Sell) &&
        _.find(legs, l => l.putCall === PutCall.Put && l.side === Side.Buy) &&
        _.find(legs, l => l.putCall === PutCall.Call && l.side === Side.Buy)) {
        return Strategy.IronCondor;
      }
    }

    const lowestExp = getLowestExpiration(legs);
    const lowest = legs.filter(l => l.expiration.getTime() === lowestExp.getTime());
    const higher = legs.filter(l => l.expiration.getTime() > lowestExp.getTime());
    if (lowest.length === 2 && higher.length === 2 &&
      lowest[0].expiration.getTime() === lowest[1].expiration.getTime() && higher[0].expiration.getTime() === higher[1].expiration.getTime() &&
      lowest[0].putCall !== lowest[1].putCall && higher[0].putCall !== higher[1].putCall) {
      return Strategy.DoubleDiagonal;
    }
  }

  return Strategy.Custom;
};

export enum TradeDirection {
  Long,
  Short,
  Neutral
}

export const getTradeDirection = (trade: Trade): TradeDirection => {
  const strategy = getStrategyFromLegs(trade.legs);

  switch (strategy) {
    case Strategy.LongShares:
    case Strategy.LongCall:
    case Strategy.ShortPut:
    case Strategy.LongCallVertical:
    case Strategy.ShortPutVertical:
    case Strategy.LongCallDiagonal:
    case Strategy.ShortPutDiagonal:
      return TradeDirection.Long;
    case Strategy.ShortShares:
    case Strategy.ShortCall:
    case Strategy.LongPut:
    case Strategy.LongPutVertical:
    case Strategy.ShortCallVertical:
    case Strategy.LongPutDiagonal:
    case Strategy.ShortCallDiagonal:
      return TradeDirection.Short;
    default:
      return TradeDirection.Neutral;
  }
};