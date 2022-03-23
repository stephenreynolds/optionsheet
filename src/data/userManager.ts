import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import logger from "../logger";
import { UserCreateModel } from "./models/user";

export class UserManager {
  private readonly pool: Pool;

  constructor(pool) {
    this.pool = pool;
  }

  public async addUser(model: UserCreateModel) {
    try {
      const res = await this.pool.query(`
          INSERT INTO app_user(uuid, username, email, password_hash)
          VALUES (uuid_generate_v4(), $1, $2, $3)
          RETURNING uuid
      `, [model.username, model.email, model.passwordHash]);

      return res.rows[0];
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async getUserByUUID(uuid: string) {
    try {
      const res = await this.pool.query(`
          SELECT *
          FROM app_user
          WHERE uuid = $1
      `, [uuid]);

      return res.rows[0];
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async getUserByUsername(username: string) {
    try {
      const res = await this.pool.query(`
          SELECT *
          FROM app_user
          WHERE username = $1
      `, [username]);

      return res.rows[0];
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async getUserByEmail(email: string) {
    try {
      const res = await this.pool.query(`
          SELECT *
          FROM app_user
          WHERE email = $1
      `, [email]);

      return res.rows[0];
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async addUserRole(userUUID: string, roleID: number) {
    try {
      await this.pool.query(`
          INSERT INTO user_role(user_id, role_id)
          VALUES ($1, $2)
      `, [userUUID, roleID]);
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async addRole(name: string) {
    try {
      await this.pool.query(`
          INSERT INTO role(name)
          VALUES ($1)
          ON CONFLICT DO NOTHING`, [name]);
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async getRoleByName(name: string) {
    try {
      const res = await this.pool.query(`
          SELECT id, name
          FROM role
          WHERE name = $1
      `, [name]);

      return res.rows[0];
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async addRefreshToken(userUUID: string, token: string, expiry: Date) {
    try {
      const res = await this.pool.query(`
          INSERT INTO refresh_token(token, expiry)
          VALUES ($1, $2)
          RETURNING token
      `, [token, expiry]);

      await this.pool.query(`UPDATE app_user
                             SET refresh_token_token = $1
                             WHERE uuid = $2`, [token, userUUID]);

      return res.rows[0];
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async getRefreshToken(token: string) {
    try {
      const res = await this.pool.query(`
          SELECT token, expiry
          FROM refresh_token
          WHERE token = $1
      `, [token]);

      return res.rows[0];
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async deleteRefreshToken(token: string) {
    try {
      await this.pool.query(`
          DELETE
          FROM refresh_token
          WHERE token = $1;
      `, [token]);
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async createToken(userUUID: string) {
    try {
      return jwt.sign({ uuid: userUUID }, config.jwt.secret, {
        expiresIn: config.jwt.jwtExpiration
      });
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  public async createRefreshToken(userUUID: string) {
    try {
      const expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + config.jwt.jwtRefreshExpiration);

      const user = await this.getUserByUUID(userUUID);

      const existingToken = await this.getRefreshToken(user.refresh_token_token);
      if (existingToken) {
        await this.deleteRefreshToken(existingToken);
      }

      return await this.addRefreshToken(user.uuid, uuidv4(), expiredAt);
    }
    catch (error) {
      logger.error(error.message);
      throw error;
    }
  }
}