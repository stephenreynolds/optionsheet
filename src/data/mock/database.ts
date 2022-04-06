import { IDatabase } from "../interfaces";
import { MockUserManager } from "./userManager";
import { MockTradeManager } from "./tradeManager";
import { MockProjectManager } from "./projectManager";

export class MockDatabase implements IDatabase {
  constructor() {
    this.projects = new MockProjectManager();
    this.trades = new MockTradeManager();
    this.users = new MockUserManager();
  }

  public projects: MockProjectManager;
  public trades: MockTradeManager;
  public users: MockUserManager;
}