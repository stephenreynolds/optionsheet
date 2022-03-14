import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
import { Database } from "../database";
import { Project } from "./project";
import { RefreshToken } from "./refreshToken";
import { Trade } from "./trade";
import { User } from "./user";

export default class MockDatabase implements Database {
  private roles = [{ id: 0, name: "user" }, { id: 1, name: "admin" }];
  private users = [];
  private tags = [];
  private projects = [];
  private trades = [];
  private legs = [];
  public static refreshTokens = [];

  // User
  public async getUserById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  public async getUserByName(username: string) {
    return this.users.find((user) => user.username === username);
  }

  public async getUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  public async saveUser(user: Partial<User>) {
    if (user.id) {
      const i = this.users.findIndex((u) => u.id === user.id);
      const existingUser = this.users[i];
      this.users[i] = { ...existingUser, ...user };
      return this.users[i];
    }
    const newUser = {
      ...user,
      id: Math.max(...this.users.map((u) => u.id)) + 1
    };
    this.users.push(newUser);
    return newUser;
  }

  public async updateUserById(id: number, user: Partial<User>) {
    const i = this.users.findIndex((u) => u.id === id);
    const existingUser = this.users[i];
    this.users[i] = { ...existingUser, ...user };
    return this.users[i];
  }

  public async deleteUserById(id: number) {
    // Remove user's refresh token.
    MockDatabase.refreshTokens = MockDatabase.refreshTokens.filter((r) => r.user.id !== id);

    const projects = this.projects.filter((project: Project) => project.user === id);

    // Remove user's projects and related trades, legs, and tags.
    for (const project of projects) {
      for (const trade of project.trades) {
        for (const leg of trade.legs) {
          this.legs = this.legs.filter((l) => l.id !== leg.id);
        }
        for (const tag of this.tags) {
          tag.trades = tag.trades.filter((t) => t.id !== trade.id);
        }
        this.trades = this.trades.filter((t) => t.id !== trade.id);
      }
      for (const tag of this.tags) {
        tag.projects = tag.projects.filter((p) => p.id !== project.id);
      }
      this.projects = this.projects.filter((p) => p.id !== project.id);
    }

    // Remove any tags which no longer have any projects or trades.
    this.tags = this.tags.filter((tag) => tag.trades.length && tag.projects.length);

    // Remove the user.
    const oldUser = this.users.find((user) => user.id === id);
    this.users = this.users.map((user) => user.id !== id);

    return oldUser;
  }

  // Role
  public async getRoleByName(name: string) {
    return this.roles.find((role) => role.name === name);
  }

  // Refresh token
  public async getRefreshToken(refreshToken: string) {
    return MockDatabase.refreshTokens.find((r) => r.token === refreshToken);
  }

  public async removeRefreshToken(refreshToken: RefreshToken) {
    const oldToken = MockDatabase.refreshTokens.find((r) => r.token === refreshToken);
    MockDatabase.refreshTokens = MockDatabase.refreshTokens.map((r) => r.token !== refreshToken);
    return oldToken;
  }

  // Project
  public async getProjectsByUserId(userId: number) {
    return this.projects.map((project) => project.user.id === userId);
  }

  public async getProject(userId: number, name: string) {
    return this.projects.find((project) => project.user.id === userId && project.name === name);
  }

  public async saveProject(project: Partial<Project>) {
    if (project.id) {
      const i = this.projects.findIndex((p) => p.id === project.id);
      const exitingProject = this.projects[i];
      this.projects[i] = { ...exitingProject, ...project };
      return this.projects[i];
    }
    const newProject = {
      ...project,
      id: Math.max(...this.projects.map((p) => p.id)) + 1
    };
    this.projects.push(newProject);
    return newProject;
  }

  public async deleteProject(project: Project) {
    // Remove user's projects and related trades, legs, and tags.
    for (const trade of project.trades) {
      for (const leg of trade.legs) {
        this.legs = this.legs.filter((l) => l.id !== leg.id);
      }
      for (const tag of this.tags) {
        tag.trades = tag.trades.filter((t) => t.id !== trade.id);
      }
      this.trades = this.trades.filter((t) => t.id !== trade.id);
    }
    for (const tag of this.tags) {
      tag.projects = tag.projects.filter((p) => p.id !== project.id);
    }
    this.projects = this.projects.filter((p) => p.id !== project.id);

    // Remove any tags which no longer have any projects or trades.
    this.tags = this.tags.filter((tag) => tag.trades.length && tag.projects.length);

    // Remove project.
    const oldProject = this.projects.findIndex((p) => p.id === project.id);
    this.projects = this.projects.filter((p) => p.id !== project.id);
    return oldProject;
  }

  public async onProjectUpdated(project: Project) {
    project.lastEdited = new Date();
    const i = this.projects.findIndex((p) => p.id === project.id);
    this.projects[i] = { ...this.projects[i], lastEdited: new Date() };
    return this.projects[i];
  }

  // Trade
  public async getTradesByProject(project: Project) {
    return this.trades.filter((trade) => trade.project.id === project.id);
  }

  public async getTradeById(id: number) {
    return this.trades.find((trade) => trade.id === id);
  }

  public async getTradeWithProject(id: number) {
    return this.trades.find((trade) => trade.id === id);
  }

  public async saveTrade(trade: Partial<Trade>) {
    if (trade.id) {
      const i = this.projects.findIndex((t) => t.id === trade.id);
      const existingTrade = this.trades[i];
      this.trades[i] = { ...existingTrade, ...trade };
      return this.trades[i];
    }
    const newTrade = {
      ...trade,
      id: Math.max(...this.trades.map((t) => t.id)) + 1
    };
    this.trades.push(newTrade);
    return newTrade;
  }

  public async deleteTrade(id: number) {
    const trade = this.trades.find((t) => t.id === id);

    // Remove related trades, legs, and tags.
    for (const leg of trade.legs) {
      this.legs = this.legs.filter((l) => l.id !== leg.id);
    }
    for (const tag of this.tags) {
      tag.trades = tag.trades.filter((t) => t.id !== trade.id);
    }

    // Remove any tags which no longer have any projects or trades.
    this.tags = this.tags.filter((tag) => tag.trades.length && tag.projects.length);

    // Remove project.
    const oldTrade = this.trades.findIndex((t) => t.id === trade.id);
    this.trades = this.trades.filter((t) => t.id !== trade.id);
    return oldTrade;
  }

  // Tokens
  public async createToken(user: User): Promise<string> {
    return jwt.sign({ id: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.jwtExpiration
    });
  }

  public async createRefreshToken(user: User): Promise<string> {
    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwt.jwtRefreshExpiration);

    const existing = MockDatabase.refreshTokens.find((r) => r.user.id === user.id);
    if (existing) {
      MockDatabase.refreshTokens = MockDatabase.refreshTokens.filter((r) => r.token !== existing.token);
    }

    const refreshToken = {
      token: uuidv4(),
      expiry: expiredAt,
      user
    };

    MockDatabase.refreshTokens.push(refreshToken);

    return refreshToken.token;
  }
}