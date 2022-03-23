enum Side {
  Buy = "Buy",
  Sell = "Sell"
}

enum PutCall {
  Put = "Put",
  Call = "Call"
}

interface LegDto {
  id: number;
  side: Side;
  quantity: number;
  open_price: number;
  close_price?: number;
  put_call?: PutCall;
  expiration?: Date;
  strike?: number;
}

export interface GetTradeDto {
  id: number;
  symbol: string;
  open_date: Date;
  close_date?: Date;
  opening_note?: string;
  closing_note?: string;
  tags?: string[];
  legs: LegDto[];
}