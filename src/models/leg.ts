export enum Side {
  Buy = "Buy",
  Sell = "Sell"
}

export enum PutCall {
  Put = "Put",
  Call = "Call"
}

export interface Leg {
  id: string;
  side: Side;
  quantity: number;
  openPrice: number;
  closePrice?: number;
  putCall?: PutCall,
  expiration?: Date;
  strike?: number;
  tradeId: string;
}