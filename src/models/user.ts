export interface User {
  id: string;
  username: string;
  email: string;
  emailConfirmed: boolean;
  passwordHash: string;
  imageUrl?: string;
  roles: string[];
}

export interface RegisterModel {
  username: string;
  email: string;
  password: string;
}

export interface AuthDetails {
  id: string;
  token: string;
  username: string;
  email: string;
  imageUrl?: string;
  roles: string[];
}