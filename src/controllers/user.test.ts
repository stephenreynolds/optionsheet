import { MockDataSource } from "../mockdb/mockDataSource";
import { createUser } from "./user";
import { UserInputError } from "apollo-server-core";
import config from "../config";

describe("createUser",  () => {
  let dataSource: MockDataSource;

  beforeAll(() => {
    config.secret = "test";
    dataSource = new MockDataSource();
  });

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
      await createUser(credentials, dataSource)
    }).rejects.toThrow(UserInputError);
  });

  it("throws when email is already in use",  async () => {
    const credentials = {
      username: "email_taken",
      email: "email_taken@test.com",
      password: "Tester42@"
    };

    await expect(async () => {
      await createUser(credentials, dataSource);
    }).rejects.toThrow( UserInputError);
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