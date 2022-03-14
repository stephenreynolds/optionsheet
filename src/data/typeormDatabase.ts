import { getRepository } from "typeorm";
import { Database } from "./database";
import { Project } from "./entities/project";
import { RefreshToken } from "./entities/refreshToken";
import { Role } from "./entities/role";
import { Trade } from "./entities/trade";
import { User } from "./entities/user";

export class TypeORMDatabase implements Database {
  // User
  public async getUserById(id: number) {
    const repository = await getRepository(User);
    return repository.findOne({ id });
  }

  public async getUserByName(username: string) {
    const repository = await getRepository(User);
    return repository.findOne({ username });
  }

  public async getUserByEmail(email: string) {
    const repository = await getRepository(User);
    return repository.findOne({ email });
  }

  public async saveUser(user: Partial<User>) {
    const repository = await getRepository(User);
    return repository.save(user);
  }

  public async updateUserById(id: number, user: Partial<User>) {
    const repository = await getRepository(User);
    return repository.update(id, user);
  }

  public async deleteUserById(id: number) {
    const repository = await getRepository(User);
    return repository.delete(id);
  }

  // Role
  public async getRoleByName(name: string) {
    const repository = await getRepository(Role);
    return repository.findOne({ name });
  }

  // Refresh token
  public async getRefreshToken(refreshToken: string) {
    const repository = await getRepository(RefreshToken);
    return repository.findOne({ token: refreshToken });
  }

  public async removeRefreshToken(refreshToken: RefreshToken) {
    const repository = await getRepository(RefreshToken);
    return repository.remove(refreshToken);
  }

  // Project
  public async getProjectsByUserId(userId: number) {
    const repository = await getRepository(Project);
    return repository.find({ user: userId });
  }

  public async getProject(userId: number, name: string) {
    const repository = await getRepository(Project);
    return repository.findOne({ user: userId, name });
  }

  public async saveProject(project: Partial<Project>) {
    const repository = await getRepository(Project);
    return repository.save(project);
  }

  public async deleteProject(project: Project) {
    const repository = await getRepository(Project);
    return repository.remove(project);
  }

  public async onProjectUpdated(project: Project) {
    const repository = await getRepository(Project);
    return repository.update({ id: project.id }, { lastEdited: new Date() });
  }

  // Trade
  public async getTradesByProject(project: Project) {
    const repository = await getRepository(Trade);
    return repository.find({ project });
  }

  public async getTradeById(id: number) {
    const repository = await getRepository(Trade);
    return repository.findOne(id);
  }

  public async getTradeWithProject(id: number) {
    const repository = await getRepository(Trade);
    return repository.findOne(id, { relations: ["project"] });
  }

  public async saveTrade(trade: Partial<Trade>) {
    const repository = await getRepository(Trade);
    return repository.save(trade);
  }

  public async deleteTrade(id: number) {
    const repository = await getRepository(Trade);
    return repository.delete(id);
  }
}