import { gql } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "../graphql/resolvers";
import typeDefs from "../graphql/schema.graphql";
import { users } from "../mockdb/users";

describe("Users", () => {
  let server;

  beforeAll(() => {
    server = new ApolloServer({ typeDefs, resolvers });
  });

  it("gets all users", async () => {
    const GET_ALL_USERS = gql`
      query {
        users {
          id
        }
      }
    `;

    const result = await server.executeOperation({
      query: GET_ALL_USERS
    });

    expect(result.data.users).toHaveLength(users.length);
  });

  it("gets a user by id", async () => {
    const GET_USER_BY_ID = gql`
      query Users($userId: ID!) {
        user(id: $userId) {
          id
        }
      }
    `;

    const id = "0";

    const result = await server.executeOperation({
      query: GET_USER_BY_ID,
      variables: { userId: id }
    });

    expect(result.data.user.id).toBe(id);
  });

  it("has property id:string", async () => {
    const GET_USER_BY_ID = gql`
      query Users($userId: ID!) {
        user(id: $userId) {
          id
        }
      }
    `;

    const result = await server.executeOperation({
      query: GET_USER_BY_ID,
      variables: { userId: 0 }
    });

    const id = result.data.user.id;

    expect(typeof id).toBe("string");
  });

  it("has property username:string", async () => {
    const GET_USER_BY_ID = gql`
      query Users($userId: ID!) {
        user(id: $userId) {
          username
        }
      }
    `;

    const result = await server.executeOperation({
      query: GET_USER_BY_ID,
      variables: { userId: 0 }
    });

    const username = result.data.user.username;

    expect(typeof username).toBe("string");
  });

  it("has property email:string", async () => {
    const GET_USER_BY_ID = gql`
      query Users($userId: ID!) {
        user(id: $userId) {
          email
        }
      }
    `;

    const result = await server.executeOperation({
      query: GET_USER_BY_ID,
      variables: { userId: 0 }
    });

    const email = result.data.user.email;

    expect(typeof email).toBe("string");
  });

  it("has property emailConfirmed:boolean", async () => {
    const GET_USER_BY_ID = gql`
      query Users($userId: ID!) {
        user(id: $userId) {
          emailConfirmed
        }
      }
    `;

    const result = await server.executeOperation({
      query: GET_USER_BY_ID,
      variables: { userId: 0 }
    });

    const emailConfirmed = result.data.user.emailConfirmed;

    expect(typeof emailConfirmed).toBe("boolean");
  });
});