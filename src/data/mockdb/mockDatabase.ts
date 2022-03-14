import { Database } from "../database";

export default class MockDatabase implements Database {
  // User
  public async getUserById(id: number) {
    return {};
  }

  public async getUserByName(username: string) {
    if (username === "invalid") {
      return undefined;
    }

    return { passwordHash: "$2a$12$8KoGjvw/AiJeeQ99qpPg5.ukdbEJuMTHTyaHi7JX1FDruID3CyVtq" };
  }

  public async getUserByEmail(email: string) {
    if (email === "invalid") {
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
    return "";
  }

  public async removeRefreshToken(refreshToken) {
    return "";
  }

  // Project
  public async getProjectsByUserId(userId: number) {
    return [];
  }

  public async getProject(userId: number, name: string) {
    return {};
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
    return "";
  }

  public async createRefreshToken(user) {
    return "";
  }
}