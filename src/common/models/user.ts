export interface CreateUserModel {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface User {
  username: string;
  url: string;
  htmlUrl: string;
  projectsUrl: string;
  email: string;
  avatarUrl: string;
  bio: string;
  createdOn: Date;
  updatedOn: Date;
  isAdmin: boolean;
}

export interface UserUpdateModel {
  username?: string;
  email?: string;
  bio?: string;
  password?: string;
}

export interface DefaultProjectSettingsModel {
  defaultStartingBalance?: number;
  defaultRisk?: number;
}