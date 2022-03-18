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

  public async getUsersByUsername(username: string, limit?: number, offset?: number) {
    return this.users
      .createQueryBuilder("user")
      .select(["user.username", "user.avatarUrl", "user.bio", "user.updatedOn"])
      .where("lower(user.username) LIKE lower(:username)", { username })
      .skip(limit * offset)
      .take(limit)
      .getMany();
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

  public async getProjectsByName(name: string, limit?: number, offset = 0) {
    return this.projects
      .createQueryBuilder("project")
      .leftJoin("project.user", "user")
      .leftJoin("project.tags", "tags")
      .loadRelationCountAndMap("project.trades", "project.trades")
      .select(["project.id", "project.name", "project.description", "project.lastEdited", "user.username", "tags"])
      .where("lower(project.name) LIKE lower(:name)", { name })
      .skip(limit * offset)
      .take(limit)
      .getMany();
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
    await this.projects.update({ id: project.id }, { lastEdited: new Date() });
    await this.users.update({ id: project.user }, { updatedOn: new Date() });
  }

  // Trade
  public async getTradesByProject(project: Project) {
    return this.trades.find({ project });
  }

  public async getTradeById(id: number) {
    return this.trades.findOne(id);
  }

  public async getTradesBySymbol(symbol: string, limit?: number, offset = 0) {
    return this.trades
      .createQueryBuilder("trade")
      .leftJoin("trade.legs", "legs")
      .leftJoin("trade.tags", "tags")
      .leftJoin("trade.project", "project")
      .leftJoin("project.user", "user")
      .select(["trade", "legs", "tags", "project.name", "user.username"])
      .where("UPPER(symbol) = UPPER(:symbol)", { symbol })
      .orderBy({ "trade.openDate": "DESC", "trade.closeDate": "DESC" })
      .skip(limit * offset)
      .take(limit)
      .getMany();
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

  // Tags
  public async createTag(name: string) {
    await this.tags.save({ name });
  }

  // Search
  public async getTradeMatches(term: string) {
    const { count } = await this.trades
      .createQueryBuilder("trade")
      .select("COUNT(trade)")
      .where("UPPER(symbol) = UPPER(:symbol)", { symbol: term })
      .getRawOne();

    return count;
  }

  public async getProjectMatches(term: string) {
    const { count } = await this.projects
      .createQueryBuilder("project")
      .select("COUNT(project)")
      .where("lower(name) LIKE lower(:name)", { name: term })
      .getRawOne();

    return count;
  }

  public async getUserMatches(term: string) {
    const { count } = await this.users
      .createQueryBuilder("user")
      .select("COUNT(user)")
      .where("lower(username) LIKE lower(:username)", { username: term })
      .getRawOne();

    return count;
  }
}