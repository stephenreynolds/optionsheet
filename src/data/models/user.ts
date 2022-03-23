export interface UserCreateModel {
  username: string;
  email: string;
  passwordHash: string;
}

export interface UserUpdateModel {
  username?: string;
  email?: string;
  passwordHash?: string;
  bio?: string;
  avatarUrl?: string;
}