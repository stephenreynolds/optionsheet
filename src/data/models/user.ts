export interface UserCreateModel {
  username: string;
  email: string;
  password_hash: string;
}

export interface UserUpdateModel {
  username?: string;
  email?: string;
  password_hash?: string;
  bio?: string;
  avatar_url?: string;
}

export interface DefaultProjectSettingsUpdateModel {
  default_starting_balance?: number;
  default_risk?: number;
}