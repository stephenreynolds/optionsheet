import { Pool } from "pg";
import { logError } from "../error";
import { CreateTradeModel, TradeUpdateModel } from "./models/trade";

export class TradeManager {
  private readonly pool: Pool;

  constructor(pool) {
    this.pool = pool;
  }

  public async getTradeById(id: number) {
    try {
      const res = await this.pool.query(`
          SELECT *
          FROM trade
          WHERE id = $1
      `, [id]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to get trade by id");
    }
  }

  public async getTradesByProject(projectId: number) {
    try {
      const res = await this.pool.query(`
          SELECT *
          FROM trade
          WHERE project_id = $1
      `, [projectId]);

      return res.rows;
    }
    catch (error) {
      logError(error, "Failed to get trades by project");
    }
  }

  public async getLegsByTradeId(id: number) {
    try {
      const res = await this.pool.query(`
          SELECT quantity, open_price, close_price, side, expiration, strike, put_call
          FROM leg
          WHERE leg.trade_id = $1
      `, [id]);

      return res.rows;
    }
    catch (error) {
      logError(error, "Failed to get trade by id");
    }
  }

  public async addTrade(projectId: number, model: CreateTradeModel) {
    try {
      // Trade
      const trade = await this.pool.query(`
          INSERT INTO trade(project_id, symbol, open_date, opening_note)
          VALUES ($1, $2, $3, $4) RETURNING *
      `, [projectId, model.symbol, model.open_date, model.opening_note]);

      const tradeId = trade.rows[0].id;

      // Legs
      for (const leg of model.legs) {
        await this.pool.query(`
            INSERT INTO leg(trade_id, quantity, open_price, side, expiration, strike, put_call)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [tradeId, leg.quantity, leg.open_price, leg.side, leg.expiration, leg.strike, leg.put_call]);
      }

      // Tags
      await this.addTradeTags(tradeId, model.tags);

      return trade.rows[0];
    }
    catch (error) {
      logError(error, "Failed to add trade");
    }
  }

  public async updateTrade(id: number, model: TradeUpdateModel) {
    try {
      const trade = await this.pool.query(`
          UPDATE trade
          SET symbol       = COALESCE($2, symbol),
              open_date    = COALESCE($3, open_date),
              close_date   = COALESCE($4, close_date),
              opening_note = COALESCE($5, opening_note),
              closing_note = COALESCE($6, closing_note)
          WHERE id = $1 RETURNING *
      `, [id, model.symbol, model.open_date, model.close_date, model.opening_note, model.closing_note]);

      const tradeId = trade.rows[0].id;

      // Legs
      if (model.legs) {
        await this.pool.query(`
            DELETE
            FROM leg
            WHERE leg.trade_id = $1
        `, [tradeId]);

        for (const leg of model.legs) {
          await this.pool.query(`
              INSERT INTO leg(trade_id, quantity, open_price, close_price, side, expiration, strike, put_call)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
          `, [tradeId, leg.quantity, leg.open_price, leg.close_price, leg.side, leg.expiration, leg.strike, leg.put_call]);
        }
      }

      // Tags
      if (model.tags) {
        await this.addTradeTags(tradeId, model.tags);
      }

      return trade.rows[0];
    }
    catch (error) {
      logError(error, "Failed to update trade");
    }
  }

  public async getTradeTags(id: number) {
    try {
      const res = await this.pool.query(`
          SELECT id, name
          FROM tag
                   LEFT JOIN trade_tag ON trade_tag.tag_id = tag.id
          WHERE trade_tag.trade_id = $1
      `, [id]);

      return res.rows;
    }
    catch (error) {
      logError(error, "Failed to get trade tags");
    }
  }

  public async addTradeTags(id: number, tags: string[]) {
    try {
      for (const newTag of tags) {
        const name = newTag.trim().toLowerCase();

        await this.pool.query(`
            INSERT INTO tag(name)
            VALUES ($1) ON CONFLICT DO NOTHING
        `, [name]);

        const tag = await this.pool.query(`
            SELECT id
            FROM tag
            WHERE name = $1
        `, [name]);

        const tagId = tag.rows[0].id;

        await this.pool.query(`
            INSERT INTO trade_tag(trade_id, tag_id)
            VALUES ($1, $2) ON CONFLICT DO NOTHING
        `, [id, tagId]);
      }
    }
    catch (error) {
      logError(error, "Failed to add trade legs");
    }
  }

  public async deleteTradeById(id: number) {
    try {
      await this.pool.query(`
          DELETE
          FROM trade
          WHERE id = $1
      `, [id]);
    }
    catch (error) {
      logError(error, "Failed to delete trade");
    }
  }

  public async getTradesBySymbol(symbol: string, limit?: number, offset = 0) {
    try {
      const trades = await this.pool.query(`
          SELECT trade.*, project.name AS project_name, app_user.username
          FROM trade
                   LEFT JOIN project ON trade.project_id = project.id
                   LEFT JOIN app_user ON project.user_uuid = app_user.uuid
          WHERE UPPER(symbol) = UPPER($1)
          ORDER BY close_date DESC, open_date DESC
          OFFSET COALESCE($2, 0) * $3 LIMIT $2
      `, [symbol, limit, offset]);

      for (let i = 0; i < trades.rows.length; ++i) {
        trades.rows[i].legs = await this.getLegsByTradeId(trades.rows[i].id);
        const tags = await this.getTradeTags(trades.rows[i].id);
        trades.rows[i].tags = tags.map((tag) => tag.name);
      }

      return trades.rows;
    }
    catch (error) {
      logError(error, "Failed to get trades by symbol");
    }
  }

  public async getTradeMatches(term: string) {
    try {
      const res = await this.pool.query(`
          SELECT COUNT(trade)
          FROM trade
          WHERE UPPER(symbol) = UPPER($1)
      `, [term]);

      return res.rows[0].count;
    }
    catch (error) {
      logError(error, "Failed to get trade match count");
    }
  }
}