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
  open_price: number;
  side: Side;
  expiration?: Date;
  strike?: number;
  put_call?: PutCall;
}

export interface CreateTradeModel {
  symbol: string;
  open_date: Date;
  opening_note?: string;
  legs: CreateLegModel[];
  tags?: string[];
}