import dateScalar from "./dateScalar";
import { createUser, login } from "../controllers/user";

export const resolvers = {
  Query: {
    users: async (_, __, { dataSources }) => dataSources.data.getUsers(),
    userById: (_, { id }, { dataSources }) => dataSources.data.getUsers().find(user => user.id === id),
    projects: (_, __, { dataSources }) => dataSources.data.getProjects(),
    projectById: (_, { id }, { dataSources }) => dataSources.data.getProjects().find(project => project.id === id),
    trades: (_, __, { dataSources }) => dataSources.data.getTrades(),
    tradeById: (_, { id }, { dataSources }) => dataSources.data.getTrades().find(trade => trade.id === id),
    login: async (_, { credentials }, { dataSources }) => {
      return await login(credentials, dataSources.data);
    }
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