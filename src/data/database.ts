import { Pool, PoolConfig } from "pg";
import { ProjectManager } from "./projectManager";
import { TradeManager } from "./tradeManager";
import { UserManager } from "./userManager";

export class Database {
  private static pool: Pool;

  public static connect(config: PoolConfig) {
    Database.pool = new Pool(config);

    Database.users = new UserManager(Database.pool);
    Database.projects = new ProjectManager(Database.pool);
    Database.trades = new TradeManager(Database.pool);
  }

  public static users: UserManager;
  public static projects: ProjectManager;
  public static trades: TradeManager;
}