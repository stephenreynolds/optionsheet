import { ITradeManager } from "../interfaces";
import { CreateTradeModel, TradeUpdateModel } from "../models/trade";

export class MockTradeManager implements ITradeManager {
  addTrade(projectId: number, model: CreateTradeModel): Promise<any> {
    return Promise.resolve(undefined);
  }

  addTradeTags(id: number, tags: string[]): Promise<void> {
    return Promise.resolve(undefined);
  }

  deleteTradeById(id: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  getLegsByTradeId(id: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  getTradeById(id: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  getTradeMatches(term: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getTradeTags(id: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  getTradesByProject(projectId: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  getTradesBySymbol(symbol: string, offset: number, limit?: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  updateTrade(id: number, model: TradeUpdateModel): Promise<any> {
    return Promise.resolve(undefined);
  }
}