import { Trade } from "../data/entities/trade";

export interface TradeSearchResult {
  trade: Trade;
  projectId: number;
}