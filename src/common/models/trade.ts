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
  putCall: PutCall;
  quantity: number;
  expiration: Date;
  strike: number;
  openPrice: number;
  closePrice?: number;
}

export interface Trade {
  id?: string;
  symbol: string;
  openDate: Date;
  closeDate?: Date;
  legs: Leg[];
  openingNote?: string;
  closingNote?: string;
  tags?: string[];
}

export interface TradeCreateModel {
  symbol: string;
  openDate: Date;
  legs: Leg[];
  openingNote?: string;
  tags?: string[];
}

export interface TradeUpdateModel {
  symbol?: string;
  openDate?: Date;
  closeDate?: Date;
  legs?: Leg[];
  openingNote?: string;
  closingNote?: string;
  tags?: string[];
}