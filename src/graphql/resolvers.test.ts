import { ApolloServer, gql } from "apollo-server-express";
import { MockDataSource } from "../mockdb/mockDb";
import { resolvers } from "./resolvers";
import typeDefs from "./schema.graphql";

describe("Register user", () => {
  let server: ApolloServer;
  let dataSource: MockDataSource;

  beforeAll(() => {
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