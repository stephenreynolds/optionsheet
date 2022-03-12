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
      expect(result.data.projects[0].id).toBeDefined();
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
      expect(result.data.trades[0].id).toBeDefined();
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
      expect(result.data.userById.roles[0].id).toBeDefined();
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
      expect(result.data.userById.projects).toBeDefined();
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
      expect(result.data.projectById.trades).toBeDefined();
    });
  });
});