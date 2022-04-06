import { DefaultProjectSettingsUpdateModel, UserCreateModel, UserUpdateModel } from "./models/user";
import { ProjectCreateModel, ProjectUpdateModel } from "./models/project";
import { CreateTradeModel, TradeUpdateModel } from "./models/trade";

export interface IDatabase {
  users: IUserManager;
  projects: IProjectManager;
  trades: ITradeManager;
}

export interface IUserManager {
  addUser(model: UserCreateModel): Promise<any>;

  updateUser(userUUID: string, model: UserUpdateModel): Promise<any>;

  deleteUser(userUUID: string): Promise<void>;

  getUserByUUID(uuid: string): Promise<any>;

  getUserByUsername(username: string): Promise<any>;

  getUserByEmail(email: string): Promise<any>;

  addUserRole(userUUID: string, roleId: number): Promise<void>;

  getRoleByName(name: string): Promise<any>;

  getDefaultProjectSettings(userUUID: string): Promise<any>;

  updateDefaultProjectSettings(userUUID: string, model: DefaultProjectSettingsUpdateModel): Promise<any>;

  addRefreshToken(userUUID: string, token: string, expiry: Date): Promise<any>;

  getRefreshToken(token: string): Promise<any>;

  deleteRefreshToken(token: string): Promise<void>;

  createToken(userUUID: string): Promise<any>;

  createRefreshToken(userUUID: string): Promise<any>;

  createTokenFromRefreshToken(refreshToken: string): Promise<any>;

  getStarredProjects(userUUID: string): Promise<any>;

  starProject(userUUID: string, projectId: number): Promise<any>;

  unStarProject(userUUID: string, projectId: number): Promise<void>;

  getStarredProject(userUUID: string, projectId: number): Promise<any>;

  getPinnedProjects(userUUID: string): Promise<any>;

  setPinnedProjects(userUUID: string, projectsIds: number[]): Promise<any>;

  getUsersByUsername(username: string, offset: number, limit?: number): Promise<any>;

  getUserMatches(term: string): Promise<any>;
}

export interface IProjectManager {
  getUserProjects(userUUID: string): Promise<any>;

  getProjectById(id: number): Promise<any>;

  getProjectByName(userUUID: string, name: string): Promise<any>;

  addProject(userUUID: string, model: ProjectCreateModel): Promise<any>;

  updateProject(id: number, model: ProjectUpdateModel): Promise<any>;

  deleteProject(id: number): Promise<void>;

  getProjectTags(id: number): Promise<any>;

  addProjectTags(id: number, tags: string[]): Promise<void>;

  getProjectsByName(name: string, offset: number, limit?: number): Promise<any>;

  getProjectMatches(term: string): Promise<any>;
}

export interface ITradeManager {
  getTradeById(id: number): Promise<any>;

  getTradesByProject(projectId: number): Promise<any>;

  getLegsByTradeId(id: number): Promise<any>;

  addTrade(projectId: number, model: CreateTradeModel): Promise<any>;

  updateTrade(id: number, model: TradeUpdateModel): Promise<any>;

  getTradeTags(id: number): Promise<any>;

  addTradeTags(id: number, tags: string[]): Promise<void>;

  deleteTradeById(id: number): Promise<void>;

  getTradesBySymbol(symbol: string, offset: number, limit?: number): Promise<any>;

  getTradeMatches(term: string): Promise<any>;
}