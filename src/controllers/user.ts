import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthDetails, RegisterModel, User } from "../models/user";
import config from "../config";
import { MockDataSource } from "../mockdb/mockDataSource";
import { UserInputError } from "apollo-server-core";
import { AuthenticationError } from "apollo-server-express";

const usernameAvailable = (username: string, users: User[]) => {
  return !users.find(user => user.username === username);
};

const emailValid = (email: string) => {
  const emailRegex = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"(\[]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
  return email.length <= 255 && emailRegex.test(email);
};

const emailAvailable = (email: string, users: User[]) => {
  return !users.find(user => user.email === email);
};

const passwordValid = (password: string) => {
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  return password.length >= 8 && passwordRegex.test(password);
};

const generateToken = (id: string) => {
  return jwt.sign({ id }, config.secret, {
    expiresIn: 86400 // 24 hours
  });
};

export const createUser = async ({ username, email, password }: RegisterModel,
                                 dataSource: MockDataSource): Promise<AuthDetails> => {
  const users = dataSource.getUsers();

  if (!usernameAvailable(username, users)) {
    throw new UserInputError("Username not available");
  }
  if (!emailValid(email)) {
    throw new UserInputError("Email invalid");
  }
  if (!emailAvailable(email, users)) {
    throw new UserInputError("A user with that email already exists");
  }
  if (!passwordValid(password)) {
    throw new UserInputError("Password too weak");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = {
    username,
    email,
    passwordHash,
    roles: ["user"]
  };

  const insertedUser = dataSource.insertUser(user);
  if (insertedUser) {

    return {
      id: insertedUser.id,
      username: insertedUser.username,
      email: insertedUser.email,
      roles: insertedUser.roles,
      token: generateToken(insertedUser.id)
    };
  }

  throw new Error("Failed to create user");
};

export const login = async ({ username, email, password }, dataSource: MockDataSource) => {
  let user = dataSource.getUsers().find(user => user.email === email);
  if (!user) {
    user = dataSource.getUsers().find(user => user.username === username);
  }

  if (!user) {
    throw new UserInputError("User does not exist.");
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordIsValid) {
    throw new AuthenticationError("Incorrect password.");
  }

  const token = generateToken(user.id);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    token
  };
};