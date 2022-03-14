import { Trade } from "./trade";

export enum PutCall {
  Call = "Call",
  Put = "Put"
}

export enum Side {
  Buy = "Buy",
  Sell = "Sell"
}

export class Leg {
  id?: number;
  side: Side;
  putCall?: PutCall;
  quantity: number;
  expiration?: Date;
  strike?: number;
  openPrice: number;
  closePrice?: number;
  trade: Trade;
}