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
  putCall?: PutCall;
  quantity: number;
  expiration?: Date;
  strike?: number;
  openPrice: number;
  closePrice?: number;
}

export interface Trade {
  id?: number;
  symbol: string;
  openDate?: Date;
  closeDate?: Date;
  legs: Leg[];
  openingNote?: string;
  closingNote?: string;
  tags?: string[];
  createdOn: Date;
  updatedOn: Date;
  projectId?: number;
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