export class Trade {
  id?: number;
  type: TradeType;
  symbol: string;
  open: Date;
  closed?: Date;
  legs: Leg[];
  quantity: number;
  priceFilled: number;
  priceClosed?: number;
  openingNote?: string;
  closingNote?: string;
  tags: string[];
}

export class Leg {
  id?: number;
  strike: number;
  type: OptionType;
  side: Side;
  expiration: Date;
}

export enum TradeType {
  ShortCallVertical,
  ShortPutVertical,
  LongCallVertical,
  LongPutVertical,
  ShortStrangle,
  LongStrangle,
  ShortStraddle,
  LongStraddle,
  ShortCall,
  ShortPut,
  LongCall,
  LongPut,
  IronCondor,
  ReverseIronCondor,
  ShortCoveredCall,
  ShortCoveredPut,
  LongCoveredCall,
  LongCoveredPut,
  ShortCallButterfly,
  ShortPutButterfly,
  LongCallButterfly,
  LongPutButterfly,
  JadeLizard,
  ReverseJadeLizard,
  LongPutCalendar,
  LongCallCalendar,
  ShortStock,
  LongStock
}

export enum OptionType {
  Call,
  Put
}

export enum Side {
  Long,
  Short
}

export function tradeTypeString(type: TradeType): string {
  const r = /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g;
  return TradeType[type].toString().replace(r, "$1$4 $2$3$5");
}

export function getTradeTypes(): TradeType[] {
  return Object.values(TradeType)
    .filter((v) => typeof v === "string")
    .map((v) => TradeType[v]);
}

export function getProfitLoss(trade: Trade): number {
  if (!trade.priceClosed) {
    return undefined;
  }
  if (trade.priceFilled > 0) {
    return (trade.priceClosed - trade.priceFilled) * trade.quantity * 100;
  }
  if (trade.priceFilled < 0) {
    return (
      (Math.abs(trade.priceFilled) - trade.priceClosed) * trade.quantity * 100
    );
  }
  return trade.priceClosed;
}
