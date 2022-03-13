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
}