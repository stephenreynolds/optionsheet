import { IUserManager } from "../interfaces";
import { DefaultProjectSettingsUpdateModel, UserCreateModel, UserUpdateModel } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../../config";

export class MockUserManager implements IUserManager {
  addRefreshToken(userUUID: string, token: string, expiry: Date): Promise<any> {
    return Promise.resolve(undefined);
  }

  addUser(model: UserCreateModel): Promise<any> {
    return Promise.resolve(undefined);
  }

  addUserRole(userUUID: string, roleId: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  createRefreshToken(userUUID: string): Promise<any> {
    return Promise.resolve("");
  }

  createToken(userUUID: string): Promise<any> {
    return jwt.sign({ uuid: "0" }, config.jwt.secret, {
      expiresIn: config.jwt.expiration
    });
  }

  createTokenFromRefreshToken(refreshToken: string): Promise<any> {
    return Promise.resolve("");
  }

  deleteRefreshToken(token: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  deleteUser(userUUID: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  getDefaultProjectSettings(userUUID: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getPinnedProjects(userUUID: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getRefreshToken(token: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getRoleByName(name: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getStarredProject(userUUID: string, projectId: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  getStarredProjects(userUUID: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getUserByEmail(email: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getUserByUUID(uuid: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getUserByUsername(username: string): Promise<any> {
    return Promise.resolve({
      uuid: username === "username" ? "0" : "1",
      password_hash: "$2a$12$8KoGjvw/AiJeeQ99qpPg5.ukdbEJuMTHTyaHi7JX1FDruID3CyVtq"
    });
  }

  getUserMatches(term: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  getUsersByUsername(username: string, offset: number, limit?: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  setPinnedProjects(userUUID: string, projectsIds: number[]): Promise<any> {
    return Promise.resolve(undefined);
  }

  starProject(userUUID: string, projectId: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  unStarProject(userUUID: string, projectId: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  updateDefaultProjectSettings(userUUID: string, model: DefaultProjectSettingsUpdateModel): Promise<any> {
    return Promise.resolve(undefined);
  }

  updateUser(userUUID: string, model: UserUpdateModel): Promise<any> {
    return Promise.resolve(undefined);
  }
}