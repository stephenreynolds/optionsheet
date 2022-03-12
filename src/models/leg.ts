export enum Side {
  Buy = "Buy",
  Sell = "Sell"
}

export enum PutCall {
  Put = "Put",
  Call = "Call"
}

export interface Leg {
  id: number;
  side: Side;
  quantity: number;
  openPrice: number;
  closePrice?: number;
  putCall?: PutCall,
  expiration?: Date;
  strike?: number;
  tradeId: number;
}