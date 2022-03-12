import { ID } from "./types";

export interface User {
  id: ID;
  username: string;
  email: string;
  emailConfirmed: boolean;
  passwordHash: string;
  imageUrl?: string;
}

export interface RegisterModel {
  username: string;
  email: string;
  password: string;
}

export interface AuthDetails {
  id: ID;
  token: string;
  username: string;
  email: string;
  imageUrl?: string;
  roles: string[];
}

export interface AuthResponse {
  success: boolean;
  authDetails?: AuthDetails;
  message?: string;
}