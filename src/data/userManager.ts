import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import { logError } from "../error";
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
      logError(error, "Failed to add user");
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
      logError(error, "Failed to get user by UUID");
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
      logError(error, "Failed to get user by username");
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
      logError(error, "Failed to get user by email");
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
      logError(error, "Failed to add user role");
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
      logError(error, "Failed to add role");
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
      logError(error, "Failed to get role by name");
      throw error;
    }
  }

  public async getUserRoles(userUUID: string) {
    try {
      const res = await this.pool.query(`
          SELECT role.id, role.name
          FROM user_role
                   INNER JOIN role
                              ON user_role.role_id = role.id
          WHERE user_id = $1
      `, [userUUID]);

      return res.rows;
    }
    catch (error) {
      logError(error, "Failed to get user roles");
      throw error;
    }
  }

  public async addRefreshToken(userUUID: string, token: string, expiry: Date) {
    try {
      const res = await this.pool.query(`UPDATE app_user
                                         SET refresh_token        = $2,
                                             refresh_token_expiry = $3
                                         WHERE uuid = $1
                                         RETURNING refresh_token`, [userUUID, token, expiry]);
      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to add refresh token");
      throw error;
    }
  }

  public async getRefreshToken(token: string) {
    try {
      const res = await this.pool.query(`
          SELECT refresh_token, refresh_token_expiry
          FROM app_user
          WHERE refresh_token = $1
      `, [token]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to get refresh token");
      throw error;
    }
  }

  public async deleteRefreshToken(token: string) {
    try {
      await this.pool.query(`
          UPDATE app_user
          SET refresh_token        = NULL,
              refresh_token_expiry = NULL
          WHERE refresh_token = $1
      `, [token]);
    }
    catch (error) {
      logError(error, "Failed to delete refresh token");
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
      logError(error, "Failed to create token");
      throw error;
    }
  }

  public async createRefreshToken(userUUID: string) {
    try {
      const expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + config.jwt.jwtRefreshExpiration);

      const user = await this.getUserByUUID(userUUID);

      const refresh_token = await this.getRefreshToken(user.refresh_token_token);
      if (refresh_token) {
        await this.deleteRefreshToken(refresh_token);
      }

      return await this.addRefreshToken(user.uuid, uuidv4(), expiredAt);
    }
    catch (error) {
      logError(error, "Failed to create refresh token");
      throw error;
    }
  }

  public async createTokenFromRefreshToken(refreshToken: string) {
    const res = await this.pool.query(`
        SELECT uuid
        FROM app_user
        WHERE refresh_token = $1
    `, [refreshToken]);

    const userUUID = res.rows[0].uuid;
    return this.createToken(userUUID);
  }
}