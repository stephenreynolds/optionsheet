import { Pool } from "pg";
import logger from "../logger";
import { ProjectManager } from "./projectManager";
import { TradeManager } from "./tradeManager";
import { UserManager } from "./userManager";

export class Database {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    });

    this.users = new UserManager(this.pool);
    this.projects = new ProjectManager(this.pool);
    this.trades = new TradeManager(this.pool);

    this.seedData().then();
  }

  public users: UserManager;
  public projects: ProjectManager;
  public trades: TradeManager;

  private async seedData() {
    try {
      await this.users.addRole("user");
    }
    catch (error) {
      logger.error(error.message);
    }
  }
}