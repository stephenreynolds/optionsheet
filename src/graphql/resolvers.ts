import dateScalar from "./dateScalar";
import { createUser } from "../controllers/user";

export const resolvers = {
  Query: {
    users: async (_, __, { dataSources }) => dataSources.data.getUsers(),
    userById: (_, args, { dataSources }) => dataSources.data.getUsers().find(user => user.id === args.id),
    projects: (_, __, { dataSources }) => dataSources.data.getProjects(),
    trades: (_, __, { dataSources }) => dataSources.data.getTrades()
  },
  Mutation: {
    register: async (_, { credentials }, { dataSources }) => {
      return await createUser(credentials, dataSources.data);
    }
  },
  User: {
    roles: (user, _, { dataSources }) => {
      return dataSources.data.getUserRoles()
        .filter(ur => ur.userId === user.id)
        .map(ur => dataSources.data.getRoles().find(r => r.id === ur.roleId));
    },
    projects: (user, _, { dataSources }) => {
      return dataSources.data.getProjects().filter(p => p.userId === user.id);
    }
  },
  Project: {
    trades: (project, _, { dataSources }) => {
      return dataSources.data.getTrades().filter(t => t.projectId === project.id);
    }
  },
  Trade: {
    legs: (trade, _, { dataSources }) => {
      return dataSources.data.getLegs().filter(l => l.tradeId === trade.id);
    }
  },
  Date: dateScalar
};