import jwt from "jsonwebtoken";
import { Connection, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import { Database } from "./database";
import { Project } from "./entities/project";
import { RefreshToken } from "./entities/refreshToken";
import { Role } from "./entities/role";
import { Tag } from "./entities/tag";
import { Trade } from "./entities/trade";
import { User } from "./entities/user";

export class OrmDatabase implements Database {
  private readonly users: Repository<User>;
  private readonly roles: Repository<Role>;
  private readonly refreshTokens: Repository<RefreshToken>;
  private readonly tags: Repository<Tag>;
  private readonly projects: Repository<Project>;
  private readonly trades: Repository<Trade>;

  constructor(connection: Connection) {
    this.users = connection.getRepository(User);
    this.roles = connection.getRepository(Role);
    this.refreshTokens = connection.getRepository(RefreshToken);
    this.tags = connection.getRepository(Tag);
    this.projects = connection.getRepository(Project);
    this.trades = connection.getRepository(Trade);
  }

  // User
  public async getUserById(id: number) {
    return this.users.findOne({ id });
  }

  public async getUserByName(username: string) {
    return this.users.findOne({ username });
  }

  public async getUserByEmail(email: string) {
    return this.users.findOne({ email });
  }

  public async saveUser(user: Partial<User>) {
    return this.users.save(user);
  }

  public async updateUserById(id: number, user: Partial<User>) {
    return this.users.update(id, user);
  }

  public async deleteUserById(id: number) {
    return this.users.delete(id);
  }

  // Role
  public async getRoleByName(name: string) {
    return this.roles.findOne({ name });
  }

  // Refresh token
  public async getRefreshToken(refreshToken: string) {
    return this.refreshTokens.findOne({ token: refreshToken });
  }

  public async removeRefreshToken(refreshToken: RefreshToken) {
    return this.refreshTokens.remove(refreshToken);
  }

  // Project
  public async getProjectsByUserId(userId: number) {
    return this.projects.find({ user: userId });
  }

  public async getProject(userId: number, name: string) {
    return this.projects.findOne({ user: userId, name });
  }

  public async saveProject(project: Partial<Project>) {
    return this.projects.save(project);
  }

  public async deleteProject(project: Project) {
    return this.projects.remove(project);
  }

  public async onProjectUpdated(project: Project) {
    return this.projects.update({ id: project.id }, { lastEdited: new Date() });
  }

  // Trade
  public async getTradesByProject(project: Project) {
    return this.trades.find({ project });
  }

  public async getTradeById(id: number) {
    return this.trades.findOne(id);
  }

  public async getTradeWithProject(id: number) {
    return this.trades.findOne(id, { relations: ["project"] });
  }

  public async saveTrade(trade: Partial<Trade>) {
    return this.trades.save(trade);
  }

  public async deleteTrade(id: number) {
    return this.trades.delete(id);
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

    const existing = await this.refreshTokens.findOne({ user });
    if (existing) {
      await this.refreshTokens.remove(existing);
    }

    const refreshToken = await this.refreshTokens.save({
      token: uuidv4(),
      expiry: expiredAt,
      user
    });

    return refreshToken.token;
  }
}