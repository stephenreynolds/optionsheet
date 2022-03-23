import { Pool } from "pg";
import { logError } from "../error";
import { CreateTradeModel } from "./models/trade";

export class TradeManager {
  private readonly pool: Pool;

  constructor(pool) {
    this.pool = pool;
  }

  public async addTrade(projectId: number, model: CreateTradeModel) {
    try {
      // Trade
      const trade = await this.pool.query(`
          INSERT INTO trade(project_id, symbol, open_date, opening_note)
          VALUES ($1, $2, $3, $4)
          RETURNING *
      `, [projectId, model.symbol, model.openDate, model.openingNote]);

      const tradeId = trade.rows[0].id;

      // Legs
      for (const leg of model.legs) {
        const newLeg = await this.pool.query(`
            INSERT INTO leg(trade_id, quantity, open_price, side)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, [tradeId, leg.quantity, leg.openPrice, leg.side]);

        // Option part of leg if provided
        if (leg.expiration && leg.strike && leg.putCall) {
          const legId = newLeg.rows[0].id;

          await this.pool.query(`
              INSERT INTO option(leg_id, expiration, strike, put_call)
              VALUES ($1, $2, $3, $4)
          `, [legId, leg.expiration, leg.strike, leg.putCall]);
        }
      }

      // Tags
      await this.addTradeTags(tradeId, model.tags);

      return trade.rows[0];
    }
    catch (error) {
      logError(error, "Failed to add trade");
    }
  }

  public async addTradeTags(id: number, tags: string[]) {
    for (const newTag of tags) {
      const name = newTag.trim().toLowerCase();

      let tag = await this.pool.query(`
          SELECT id, name
          FROM tag
          WHERE name = $1
      `, [name]);

      if (!tag.rows.length) {
        tag = await this.pool.query(`
            INSERT INTO tag(name)
            VALUES ($1)
            RETURNING id, name
        `, [name]);
      }

      const tagId = tag.rows[0].id;

      await this.pool.query(`
          INSERT INTO trade_tag(trade_id, tag_id)
          VALUES ($1, $2)
      `, [id, tagId]);
    }
  }
}