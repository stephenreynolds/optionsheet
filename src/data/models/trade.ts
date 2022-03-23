export enum Side {
  Buy = "Buy",
  Sell = "Sell"
}

export enum PutCall {
  Put = "Put",
  Call = "Call"
}

interface CreateLegModel {
  quantity: number;
  openPrice: number;
  side: Side;
  expiration?: Date;
  strike?: number;
  putCall?: PutCall;
}

export interface CreateTradeModel {
  symbol: string;
  openDate: Date;
  openingNote?: string;
  legs: CreateLegModel[];
  tags?: string[];
}