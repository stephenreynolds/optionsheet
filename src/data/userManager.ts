import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import { logError } from "../error";
import { DefaultProjectSettingsUpdateModel, UserCreateModel, UserUpdateModel } from "./models/user";
import { IUserManager } from "./interfaces";

export class UserManager implements IUserManager {
  private readonly pool: Pool;

  constructor(pool) {
    this.pool = pool;
  }

  async addUser(model: UserCreateModel) {
    try {
      const res = await this.pool.query(`
          INSERT INTO app_user(uuid, username, email, password_hash)
          VALUES (uuid_generate_v4(), $1, $2, $3)
          RETURNING uuid
      `, [model.username, model.email, model.password_hash]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to add user");
    }
  }

  async updateUser(userUUID: string, model: UserUpdateModel) {
    try {
      const res = await this.pool.query(`
          UPDATE app_user
          SET username      = COALESCE($2, username),
              email         = COALESCE($3, email),
              password_hash = COALESCE($4, password_hash),
              bio           = COALESCE($5, bio),
              avatar_url    = COALESCE($6, avatar_url)
          WHERE uuid = $1
          RETURNING *
      `, [userUUID, model.username, model.email, model.password_hash, model.bio, model.avatar_url]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to update user");
    }
  }

  async deleteUser(userUUID: string) {
    try {
      await this.pool.query(`
          DELETE
          FROM app_user
          WHERE uuid = $1`, [userUUID]);
    }
    catch (error) {
      logError(error, "Failed to delete user");
    }
  }

  async getUserByUUID(uuid: string) {
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
    }
  }

  async getUserByUsername(username: string) {
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
    }
  }

  async getUserByEmail(email: string) {
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
    }
  }

  async addUserRole(userUUID: string, roleId: number) {
    try {
      await this.pool.query(`
          INSERT INTO user_role(user_id, role_id)
          VALUES ($1, $2)
      `, [userUUID, roleId]);
    }
    catch (error) {
      logError(error, "Failed to add user role");
    }
  }

  async getRoleByName(name: string) {
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
    }
  }

  async getDefaultProjectSettings(userUUID: string) {
    try {
      const res = await this.pool.query(`
          SELECT default_starting_balance, default_risk
          FROM app_user
          WHERE uuid = $1
      `, [userUUID]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to get user settings");
    }
  }

  async updateDefaultProjectSettings(userUUID: string, model: DefaultProjectSettingsUpdateModel) {
    try {
      const res = await this.pool.query(`
          UPDATE app_user
          SET default_starting_balance = $2,
              default_risk             = $3
          WHERE uuid = $1
          RETURNING default_starting_balance, default_risk
      `, [userUUID, model.default_starting_balance, model.default_risk]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to update user settings");
    }
  }

  async addRefreshToken(userUUID: string, token: string, expiry: Date) {
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
    }
  }

  async getRefreshToken(token: string) {
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
    }
  }

  async deleteRefreshToken(token: string) {
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
    }
  }

  async createToken(userUUID: string) {
    try {
      return jwt.sign({ uuid: userUUID }, config.jwt.secret, {
        expiresIn: config.jwt.expiration
      });
    }
    catch (error) {
      logError(error, "Failed to create token");
    }
  }

  async createRefreshToken(userUUID: string) {
    try {
      const expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + config.jwt.refreshExpiration);

      const user = await this.getUserByUUID(userUUID);

      const refresh_token = await this.getRefreshToken(user.refresh_token_token);
      if (refresh_token) {
        await this.deleteRefreshToken(refresh_token);
      }

      return await this.addRefreshToken(user.uuid, uuidv4(), expiredAt);
    }
    catch (error) {
      logError(error, "Failed to create refresh token");
    }
  }

  async createTokenFromRefreshToken(refreshToken: string) {
    try {
      const res = await this.pool.query(`
          SELECT uuid
          FROM app_user
          WHERE refresh_token = $1
      `, [refreshToken]);

      const userUUID = res.rows[0].uuid;
      return this.createToken(userUUID);
    }
    catch (error) {
      logError(error, "Failed to create token from refresh token");
    }
  }

  async getStarredProjects(userUUID: string) {
    try {
      const res = await this.pool.query(`
          SELECT project.*
          FROM starred_project
                   LEFT JOIN project ON project.id = starred_project.project_id
          WHERE starred_project.user_uuid = $1
      `, [userUUID]);

      return res.rows;
    }
    catch (error) {
      logError(error, "Failed to get starred projects");
    }
  }

  async starProject(userUUID: string, projectId: number) {
    try {
      const res = await this.pool.query(`
          INSERT INTO starred_project(user_uuid, project_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          RETURNING user_uuid, project_id
      `, [userUUID, projectId]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to star project");
    }
  }

  async unStarProject(userUUID: string, projectId: number) {
    try {
      await this.pool.query(`
          DELETE
          FROM starred_project
          WHERE user_uuid = $1
            AND project_id = $2
      `, [userUUID, projectId]);
    }
    catch (error) {
      logError(error, "Failed to un-star project");
    }
  }

  async getStarredProject(userUUID: string, projectId: number) {
    try {
      const res = await this.pool.query(`
          SELECT *
          FROM starred_project
          WHERE user_uuid = $1
            AND project_id = $2
      `, [userUUID, projectId]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to get starred project");
    }
  }

  async getPinnedProjects(userUUID: string) {
    try {
      const res = await this.pool.query(`
          SELECT pinned_projects
          FROM app_user
          WHERE uuid = $1
      `, [userUUID]);

      return res.rows[0].pinned_projects;
    }
    catch (error) {
      logError(error, "Failed to get pinned projects");
    }
  }

  async setPinnedProjects(userUUID: string, projectsIds: number[]) {
    try {
      const res = await this.pool.query(`
          UPDATE app_user
          SET pinned_projects = $2
          WHERE uuid = $1
          RETURNING pinned_projects
      `, [userUUID, projectsIds]);

      return res.rows[0];
    }
    catch (error) {
      logError(error, "Failed to add pinned project");
    }
  }

  async getUsersByUsername(username: string, offset: number, limit?: number): Promise<any> {
    try {
      const res = await this.pool.query(`
          SELECT username, avatar_url, bio, updated_on
          FROM app_user
          WHERE LOWER(username) LIKE LOWER($1)
          OFFSET COALESCE($2, 0) * $3 LIMIT $2
      `, [username, limit, offset]);

      return res.rows;
    }
    catch (error) {
      logError(error, "Failed to get users by username");
    }
  }

  async getUserMatches(term: string) {
    try {
      const res = await this.pool.query(`
          SELECT COUNT(app_user)
          FROM app_user
          WHERE LOWER(username) LIKE LOWER($1)
      `, [term]);

      return res.rows[0].count;
    }
    catch (error) {
      logError(error, "Failed to get user match count");
    }
  }
}