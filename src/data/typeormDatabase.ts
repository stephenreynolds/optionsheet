import { getRepository } from "typeorm";
import { Project } from "./entities/project";
import { RefreshToken } from "./entities/refreshToken";
import { Role } from "./entities/role";
import { Trade } from "./entities/trade";
import { User } from "./entities/user";

// User
export const getUserById = async (id: number) => {
  const repository = await getRepository(User);
  return repository.findOne({ id });
};

export const getUserByName = async (username: string) => {
  const repository = await getRepository(User);
  return repository.findOne({ username });
};

export const getUserByEmail = async (email: string) => {
  const repository = await getRepository(User);
  return repository.findOne({ email });
};

export const saveUser = async (user: Partial<User>) => {
  const repository = await getRepository(User);
  return repository.save(user);
};

export const updateUserById = async (id: number, user: Partial<User>) => {
  const repository = await getRepository(User);
  return repository.update(id, user);
};

export const deleteUserById = async (id: number) => {
  const repository = await getRepository(User);
  return repository.delete(id);
};

// Role
export const getRoleByName = async (name: string) => {
  const repository = await getRepository(Role);
  return repository.findOne({ name });
};

// Refresh token
export const getRefreshToken = async (refreshToken: string) => {
  const repository = await getRepository(RefreshToken);
  return repository.findOne({ token: refreshToken });
};

export const removeRefreshToken = async (refreshToken: RefreshToken) => {
  const repository = await getRepository(RefreshToken);
  return repository.remove(refreshToken);
};

// Project
export const getProjectsByUserId = async (userId: number) => {
  const repository = await getRepository(Project);
  return repository.find({ user: userId });
};

export const getProject = async (userId: number, name: string) => {
  const repository = await getRepository(Project);
  return repository.findOne({ user: userId, name });
};

export const saveProject = async (project: Partial<Project>) => {
  const repository = await getRepository(Project);
  return repository.save(project);
};

export const deleteProject = async (project: Project) => {
  const repository = await getRepository(Project);
  return repository.remove(project);
};

export const onProjectUpdated = async (project: Project) => {
  const repository = await getRepository(Project);
  return repository.update({ id: project.id }, { lastEdited: new Date() });
};

// Trade
export const getTradesByProject = async (project: Project) => {
  const repository = await getRepository(Trade);
  return repository.find({ project });
};

export const getTradeById = async (id: number) => {
  const repository = await getRepository(Trade);
  return repository.findOne(id);
};

export const getTradeWithProject = async (id: number) => {
  const repository = await getRepository(Trade);
  return repository.findOne(id, { relations: ["project"] });
};

export const saveTrade = async (trade: Partial<Trade>) => {
  const repository = await getRepository(Trade);
  return repository.save(trade);
};

export const deleteTrade = async (id: number) => {
  const repository = await getRepository(Trade);
  return repository.delete(id);
};