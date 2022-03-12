import { ApolloServer, gql } from "apollo-server-express";
import { MockDataSource } from "../mockdb/mockDataSource";
import { resolvers } from "./resolvers";
import typeDefs from "./schema.graphql";
import config from "../config";

let server: ApolloServer;
let dataSource: MockDataSource;

beforeAll(() => {
  config.secret = "test";
  dataSource = new MockDataSource();
  server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        data: dataSource
      };
    }
  });
});

describe("Query", () => {
  describe("users", () => {
    it("gets a list of users", async () => {
      const query = gql`
          query Users {
              users {
                  id
              }
          }
      `;

      const result = await server.executeOperation({ query });

      expect(result.errors).toBeUndefined();
      expect(result.data.users[0].id).toBeDefined();
    });
  });

  describe("userById", () => {
    it("gets a user by id", async () => {
      const query = gql`
          query UserById($userId: ID!) {
              userById(id: $userId) {
                  id
              }
          }
      `;

      const userId = dataSource.getUsers()[0].id;
      const result = await server.executeOperation({ query, variables: { userId } });

      expect(result.errors).toBeUndefined();
      expect(result.data.userById.id).toBe(userId);
    });
  });

  describe("projects", () => {
    it("gets a list of projects", async () => {
      const query = gql`
          query Projects {
              projects {
                  id
              }
          }
      `;

      const result = await server.executeOperation({ query });

      expect(result.errors).toBeUndefined();

      const projects = dataSource.getProjects();

      expect(result.data.projects).toHaveLength(projects.length);
    });
  });

  describe("projectById", () => {
    it("gets a project by id", async () => {
      const query = gql`
          query ProjectById($projectId: ID!) {
              projectById(id: $projectId) {
                  id
              }
          }
      `;

      const projectId = dataSource.getProjects()[0].id;
      const result = await server.executeOperation({ query, variables: { projectId } });

      expect(result.errors).toBeUndefined();
      expect(result.data.projectById.id).toBe(projectId);
    });
  });

  describe("trades", () => {
    it("gets a list of trades", async () => {
      const query = gql`
          query Trades {
              trades {
                  id
              }
          }
      `;

      const result = await server.executeOperation({ query });

      expect(result.errors).toBeUndefined();

      const trades = dataSource.getTrades();

      expect(result.data.trades).toHaveLength(trades.length);
    });
  });
});

describe("Mutation", () => {
  describe("register", () => {
    it("creates a user", async () => {
      const query = gql`
          mutation Register($credentials: RegisterInput) {
              register(credentials: $credentials) {
                  id
              }
          }
      `;

      const result = await server.executeOperation({
        query,
        variables: {
          credentials: {
            username: "new_user",
            email: "new_user@test.com",
            password: "Tester42@"
          }
        }
      });

      expect(result.errors).toBeUndefined();

      const newUser = dataSource.getUsers().find(user => user.id === result.data.register.id);
      expect(newUser.id).toBe(result.data.register.id);
    });
  });
});

describe("User", () => {
  describe("roles", () => {
    it("gets a list of roles for a user with id", async () => {
      const query = gql`
          query Roles($userId: ID!) {
              userById(id: $userId) {
                  roles {
                      id
                  }
              }
          }
      `;

      const userId = dataSource.getUsers()[0].id;
      const result = await server.executeOperation({ query, variables: { userId } });

      expect(result.errors).toBeUndefined();

      const roles = dataSource.getUserRoles().filter(role => role.userId === userId);

      expect(result.data.userById.roles).toHaveLength(roles.length);
    });
  });

  describe("projects", () => {
    it("gets a list of projects for a user with id", async () => {
      const query = gql`
          query Projects($userId: ID!) {
              userById(id: $userId) {
                  projects {
                      id
                  }
              }
          }
      `;

      const userId = dataSource.getUsers()[0].id;
      const result = await server.executeOperation({ query, variables: { userId } });

      expect(result.errors).toBeUndefined();

      const projects = dataSource.getProjects().filter(project => project.userId === userId);

      expect(result.data.userById.projects).toHaveLength(projects.length);
    });
  });
});

describe("Projects", () => {
  describe("trades", () => {
    it("gets a list of trades for a project by id", async () => {
      const query = gql`
          query Trades($projectId: ID!) {
              projectById(id: $projectId) {
                  trades {
                      id
                  }
              }
          }
      `;

      const projectId = dataSource.getProjects()[0].id;
      const result = await server.executeOperation({ query, variables: { projectId } });

      expect(result.errors).toBeUndefined();

      const trades = dataSource.getTrades().filter(trade => trade.id === projectId);

      expect(result.data.projectById.trades).toHaveLength(trades.length);
    });
  });
});

describe("Trades", () => {
  describe("legs", () => {
    it("gets a list of legs for a trade by id", async () => {
      const query = gql`
          query Legs($tradeId: ID!) {
              tradeById(id: $tradeId) {
                  legs {
                      id
                  }
              }
          }
      `;

      const tradeId = dataSource.getTrades()[0].id;
      const result = await server.executeOperation({ query, variables: { tradeId } });

      expect(result.errors).toBeUndefined();

      const legs = dataSource.getLegs().filter(leg => leg.tradeId === tradeId);
      expect(result.data.tradeById.legs).toHaveLength(legs.length);
    });
  });
});