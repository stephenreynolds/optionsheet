export enum Side {
  Buy = "Buy",
  Sell = "Sell"
}

export enum PutCall {
  Call = "Call",
  Put = "Put"
}

export interface Leg {
  side: Side;
  put_call?: PutCall;
  quantity: number;
  expiration?: Date;
  strike?: number;
  open_price: number;
  close_price?: number;
}

export interface Trade {
  id?: string;
  symbol: string;
  open_date: Date;
  close_date?: Date;
  legs: Leg[];
  opening_note?: string;
  closing_note?: string;
  tags?: string[];
  created_on: Date;
  updated_on: Date;
}

export interface TradeCreateModel {
  symbol: string;
  open_date: Date;
  legs: Leg[];
  opening_note?: string;
  tags?: string[];
}

export interface TradeUpdateModel {
  symbol?: string;
  open_date?: Date;
  close_date?: Date;
  legs?: Leg[];
  opening_note?: string;
  closing_note?: string;
  tags?: string[];
}