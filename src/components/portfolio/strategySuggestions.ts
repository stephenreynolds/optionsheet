import { Strategy } from "../../common/strategy";
import _ from "lodash";

export enum DirectionalBias {
  Bullish = "Bullish",
  Bearish = "Bearish",
  Neutral = "Neutral"
}

export enum RiskOn {
  On = "Risk On",
  Off = "Risk Off",
  Neutral = "Neutral"
}

export enum ShortLong {
  Short,
  Long,
  Neutral
}

export enum RiskLimit {
  Limited,
  Unlimited,
  Shares
}

interface StrategyEnv {
  name: Strategy;
  delta: ShortLong;
  theta: ShortLong;
  riskLimit: RiskLimit;
}

const strategies: StrategyEnv[] = [
  {
    name: Strategy.LongShares,
    delta: ShortLong.Long,
    theta: ShortLong.Short,
    riskLimit: RiskLimit.Shares
  },
  {
    name: Strategy.ShortShares,
    delta: ShortLong.Short,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Shares
  },
  {
    name: Strategy.LongCall,
    delta: ShortLong.Long,
    theta: ShortLong.Short,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.LongPut,
    delta: ShortLong.Short,
    theta: ShortLong.Short,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.ShortCall,
    delta: ShortLong.Short,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Unlimited
  },
  {
    name: Strategy.ShortPut,
    delta: ShortLong.Long,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Unlimited
  },
  {
    name: Strategy.LongCallVertical,
    delta: ShortLong.Long,
    theta: ShortLong.Short,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.LongPutVertical,
    delta: ShortLong.Short,
    theta: ShortLong.Short,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.ShortCallVertical,
    delta: ShortLong.Short,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.ShortPutVertical,
    delta: ShortLong.Long,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.IronCondor,
    delta: ShortLong.Neutral,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.Calendar,
    delta: ShortLong.Neutral,
    theta: ShortLong.Short,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.LongCallDiagonal,
    delta: ShortLong.Long,
    theta: ShortLong.Short,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.LongPutDiagonal,
    delta: ShortLong.Short,
    theta: ShortLong.Short,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.ShortCallDiagonal,
    delta: ShortLong.Short,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.ShortPutDiagonal,
    delta: ShortLong.Long,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.Butterfly,
    delta: ShortLong.Neutral,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.DoubleDiagonal,
    delta: ShortLong.Neutral,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Limited
  },
  {
    name: Strategy.Strangle,
    delta: ShortLong.Neutral,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Unlimited
  },
  {
    name: Strategy.Straddle,
    delta: ShortLong.Neutral,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Unlimited
  },
  {
    name: Strategy.JadeLizard,
    delta: ShortLong.Long,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Unlimited
  },
  {
    name: Strategy.IronFly,
    delta: ShortLong.Neutral,
    theta: ShortLong.Long,
    riskLimit: RiskLimit.Limited
  },
];

const longDelta = strategies.filter((strategy) => strategy.delta === ShortLong.Long);
const shortDelta = strategies.filter((strategy) => strategy.delta === ShortLong.Short);
const neutralDelta = strategies.filter((strategy) => strategy.delta === ShortLong.Neutral);
const longTheta = strategies.filter((strategy) => strategy.theta === ShortLong.Long);
const shortTheta = strategies.filter((strategy) => strategy.theta === ShortLong.Short);
const limitedRisk = strategies.filter((strategy) => strategy.riskLimit === RiskLimit.Limited);

export const getStrategySuggestions = (currentDelta: number, currentTheta: number, targetDelta: number, targetTheta: number, limitedRiskOnly = false) => {
  if (currentDelta < targetDelta * 0.9) {
    // Bullish strategies
    if (currentTheta < targetTheta * 0.9) {
      if (limitedRiskOnly) {
        return _.intersection(longDelta, longTheta, limitedRisk);
      }
      return _.intersection(longDelta, longTheta);
    }
    else if (currentTheta > targetTheta * 1.1) {
      if (limitedRiskOnly) {
        return _.intersection(longDelta, shortTheta, limitedRisk);
      }
      return _.intersection(longDelta, shortTheta);
    }
    if (limitedRiskOnly) {
      return _.intersection(longDelta, limitedRisk);
    }
    return _.intersection(longDelta);
  }
  else if (currentDelta > targetDelta * 1.1) {
    // Bearish strategies
    if (currentTheta < targetTheta * 0.9) {
      if (limitedRiskOnly) {
        return _.intersection(shortDelta, longTheta, limitedRisk);
      }
      return _.intersection(shortDelta, longTheta);
    }
    else if (currentTheta > targetTheta * 1.1) {
      if (limitedRiskOnly) {
        return _.intersection(shortDelta, shortTheta, limitedRisk);
      }
      return _.intersection(shortDelta, shortTheta);
    }
    if (limitedRiskOnly) {
      return _.intersection(shortDelta, limitedRisk);
    }
    return _.intersection(shortDelta);
  }
  else {
    // Neutral strategies
    if (currentTheta < targetTheta * 0.9) {
      if (limitedRiskOnly) {
        return _.intersection(neutralDelta, longTheta, limitedRisk);
      }
      return _.intersection(neutralDelta, longTheta);
    }
    else if (currentTheta > targetTheta * 1.1) {
      if (limitedRiskOnly) {
        return _.intersection(neutralDelta, shortTheta, limitedRisk);
      }
      return _.intersection(neutralDelta, shortTheta);
    }
    if (limitedRiskOnly) {
      return _.intersection(neutralDelta, limitedRisk);
    }
    return _.intersection(neutralDelta);
  }
};