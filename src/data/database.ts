import { Pool } from "pg";
import { ProjectManager } from "./projectManager";
import { TradeManager } from "./tradeManager";
import { UserManager } from "./userManager";
import { IDatabase } from "./interfaces";

export class Database implements IDatabase {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    });

    this.users = new UserManager(this.pool);
    this.projects = new ProjectManager(this.pool);
    this.trades = new TradeManager(this.pool);
  }

  public users: UserManager;
  public projects: ProjectManager;
  public trades: TradeManager;
}