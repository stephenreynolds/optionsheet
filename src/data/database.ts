import { Pool } from "pg";
import logger from "../logger";

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

    this.seedData();
  }

  private seedData() {
    try {
      this.pool.query("CALL add_role($1)", ["user"]);
    }
    catch (error) {
      logger.error(error.message);
    }
  }
}