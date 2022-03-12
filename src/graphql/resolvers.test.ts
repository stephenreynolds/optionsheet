import { ApolloServer, gql } from "apollo-server-express";
import { MockDataSource } from "../mockdb/mockDataSource";
import { resolvers } from "./resolvers";
import typeDefs from "./schema.graphql";
import config from "../config";

describe("Resolvers", () => {
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

  describe("Users", () => {
    it("gets a list of users", async () => {
      const query = gql`
          query Query {
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

  describe("Register user", () => {
    it("creates a user", async () => {
      const query = gql`
          mutation Mutation($credentials: RegisterInput) {
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