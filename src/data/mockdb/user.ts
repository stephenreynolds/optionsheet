import config from "../../config";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import MockDatabase from "./mockDatabase";
import { Project } from "./project";
import { RefreshToken } from "./refreshToken";
import { Role } from "./role";

export class User {
  id?: number;
  username: string;
  email: string;
  emailConfirmed?: boolean;
  passwordHash: string;
  roles: Role[];
  projects?: Project[];
  avatarUrl?: string;
  bio?: string;
  createdOn?: Date;
  updatedOn?: Date;
  refreshToken?: RefreshToken;

  async createToken(): Promise<string> {
    return jwt.sign({ id: this.id }, config.jwt.secret, {
      expiresIn: config.jwt.jwtExpiration
    });
  }

  async createRefreshToken(): Promise<string> {
    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwt.jwtRefreshExpiration);

    const existing = MockDatabase.refreshTokens.find((r) => r.user.id === this.id);
    if (existing) {
      MockDatabase.refreshTokens = MockDatabase.refreshTokens.filter((r) => r.user.id !== this.id)
    }

    const refreshToken = {
      token: uuidv4(),
      expiry: expiredAt,
      user: this
    };

    MockDatabase.refreshTokens.push(refreshToken);

    return refreshToken.token;
  }
}