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
}