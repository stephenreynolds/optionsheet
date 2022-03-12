import { ID } from "./types";

export enum Side {
  Buy = "Buy",
  Sell = "Sell"
}

export enum PutCall {
  Put = "Put",
  Call = "Call"
}

export interface Leg {
  id: ID;
  side: Side;
  quantity: number;
  openPrice: number;
  closePrice?: number;
  putCall?: PutCall,
  expiration?: Date;
  strike?: number;
  tradeId: ID;
}