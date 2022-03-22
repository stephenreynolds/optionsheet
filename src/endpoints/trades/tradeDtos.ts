import { PutCall, Side } from "../../data/entities/leg";

interface LegDto {
  id: number;
  side: Side;
  quantity: number;
  openPrice: number;
  closePrice?: number;
  putCall?: PutCall;
  expiration?: Date;
  strike?: number;
}

export interface GetTradeDto {
  id: number;
  symbol: string;
  openDate: Date;
  closeDate?: Date;
  openingNote?: string;
  closingNote?: string;
  tags?: string[];
  legs: LegDto[];
}