import { MockDataSource } from "../mockdb/mockDataSource";
import { createUser, login } from "./user";
import { AuthenticationError, UserInputError } from "apollo-server-core";
import config from "../config";

let dataSource: MockDataSource;

beforeAll(() => {
  config.secret = "test";
  dataSource = new MockDataSource();
});

describe("createUser", () => {
  it("creates a new user", async () => {
    const credentials = {
      username: "new_user",
      email: "new_user@test.com",
      password: "Tester42@"
    };

    const result = await createUser(credentials, dataSource);
    const newUser = dataSource.getUsers().find(user => user.id === result.id);

    expect(newUser).toBeDefined();
  });

  it("throws when username is already in use", async () => {
    const dataSource = new MockDataSource();
    const credentials = {
      username: "username_taken",
      email: "username_taken@test.com",
      password: "Tester42@"
    };

    await expect(async () => {
      await createUser(credentials, dataSource);
    }).rejects.toThrow(UserInputError);
  });

  it("throws when email is already in use", async () => {
    const credentials = {
      username: "email_taken",
      email: "email_taken@test.com",
      password: "Tester42@"
    };

    await expect(async () => {
      await createUser(credentials, dataSource);
    }).rejects.toThrow(UserInputError);
  });

  it("throws when email is invalid", async () => {
    const credentials = {
      username: "email_invalid",
      email: "not an email address",
      password: "Tester42@"
    };

    await expect(async () => {
      await createUser(credentials, dataSource);
    }).rejects.toThrow(UserInputError);
  });

  it("throws when password is too weak", async () => {
    const credentials = {
      username: "weak_password",
      email: "weak_password@test.com",
      password: "Weak password"
    };

    await expect(async () => {
      await createUser(credentials, dataSource);
    }).rejects.toThrow(UserInputError);
  });
});

describe("login", () => {
  it("returns auth details after successful login", async () => {
    const credentials = { username: "test", password: "Tester42@!" };

    const result = await login(credentials, dataSource);
    expect(result.token).toBeDefined();
  });

  it("throws when password is invalid", async () => {
    const credentials = { username: "test", password: "invalid" };

    await expect(async () => {
      await login(credentials, dataSource);
    }).rejects.toThrow(AuthenticationError);
  });

  it("throws when user does not exist with username", async () => {
    const credentials = { username: "does not exist", password: "Tester42@!" };

    await expect(async () => {
      await login(credentials, dataSource);
    }).rejects.toThrow(UserInputError);
  });

  it("throws when user does not exist with email", async () => {
    const credentials = { email: "doesnotexist@test.com", password: "Tester42@!" };

    await expect(async () => {
      await login(credentials, dataSource);
    }).rejects.toThrow(UserInputError);
  });
});