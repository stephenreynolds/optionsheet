import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
import { Database } from "../database";

export default class MockDatabase implements Database {
  // User
  public async getUserById(id: number) {
    return {
      username: "username",
      email: "email",
      avatarUrl: "avatar_url",
      bio: "bio",
      roles: []
    };
  }

  public async getUserByName(username: string) {
    if (username === "undefined") {
      return undefined;
    }

    return {
      id: username === "username" ? 0 : 1,
      passwordHash: "$2a$12$8KoGjvw/AiJeeQ99qpPg5.ukdbEJuMTHTyaHi7JX1FDruID3CyVtq"
    };
  }

  public async getUserByEmail(email: string) {
    if (email === "undefined@test.com") {
      return undefined;
    }

    return {};
  }

  public async saveUser(user) {
    return {};
  }

  public async updateUserById(id: number, user) {
    return {};
  }

  public async deleteUserById(id: number) {
    return {};
  }

  // Role
  public async getRoleByName(name: string) {
    return {};
  }

  // Refresh token
  public async getRefreshToken(refreshToken: string) {
    if (refreshToken === "invalid" || refreshToken === "expired") {
      return undefined;
    }

    return { token: refreshToken, expired: false };
  }

  public async removeRefreshToken(refreshToken) {
    return "";
  }

  // Project
  public async getProjectsByUserId(userId: number) {
    if (userId === 0) {
      return [
        {
          name: "",
          description: "",
          tags: [],
          lastEdited: new Date()
        }
      ];
    }

    return [];
  }

  public async getProject(userId: number, name: string) {
    if (name === "undefined") {
      return undefined;
    }

    return {
      name,
      description: "",
      tags: [],
      lastEdited: new Date()
    };
  }

  public async saveProject(project) {
    return {};
  }

  public async deleteProject(project) {
    return {};
  }

  public async onProjectUpdated(project) {
    return {};
  }

  // Trade
  public async getTradesByProject(project) {
    return [];
  }

  public async getTradeById(id: number) {
    return {};
  }

  public async getTradeWithProject(id: number) {
    return {};
  }

  public async saveTrade(trade) {
    return {};
  }

  public async deleteTrade(id: number) {
    return {};
  }

  // Tokens
  public async createToken(user) {
    return jwt.sign({ id: 0 }, config.jwt.secret, {
      expiresIn: config.jwt.jwtExpiration
    });
  }

  public async createRefreshToken(user) {
    return uuidv4();
  }
}