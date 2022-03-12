import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthDetails, AuthResponse, RegisterModel, User } from "../models/user";
import config from "../config";
import { MockDataSource } from "../mockdb/mockDb";
import { Role } from "../models/role";

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
  return passwordRegex.test(password);
};

const getRoleByName = (name: string, roles: Role[]) => {
  return roles.find(role => role.name === name);
};

export const createUser = async ({ username, email, password }: RegisterModel, dataSource: MockDataSource): Promise<AuthResponse> => {
  const users = dataSource.getUsers();

  if (!usernameAvailable(username, users)) {
    return { success: false, message: "Username not available" };
  }
  if (!emailValid(email)) {
    return { success: false, message: "Email invalid" };
  }
  if (!emailAvailable(email, users)) {
    return { success: false, message: "A user with that email already exists" };
  }
  if (!passwordValid(password)) {
    return { success: false, message: "Password too weak" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const roles = dataSource.getRoles();
  const role = getRoleByName("user", roles);

  const user = {
    username,
    email,
    passwordHash,
    roles: [role]
  };

  const insertedUser = dataSource.insertUser(user);
  if (insertedUser) {
    const token = jwt.sign({id: insertedUser.id}, config.secret, {
      expiresIn: 86400 // 24 houts
    });
    const roleNames = user.roles.map(r => r.name);

    const details: AuthDetails = {
      id: insertedUser.id,
      username: insertedUser.username,
      email: insertedUser.email,
      roles: roleNames,
      token
    };

    return { success: true, authDetails: details };
  }

  return { success: false, message: "Failed to create user" };
};