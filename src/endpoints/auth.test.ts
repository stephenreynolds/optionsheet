import request from "supertest";
import app from "../app";
import routes from "../routes";
import mockDataService from "../data/mockdb/mockDataService";

beforeAll(() => {
  app.use(mockDataService, routes);
});

describe("POST /auth", () => {
  describe("given valid credentials", () => {
    // should send 400 if neither a username nor email was provided
    // should send 404 if username or email was provided but no such user exists
    // should send 401 if user exists but password is invalid
    // should send a jwt token if user was authenticated
    // should create a refresh token and send if the user was authenticated

    it("should respond with 200 status code", async () => {
      const credentials = { username: "username", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(200);
    });

    it("should specify json in the content type header", async () => {
      const credentials = { username: "username", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
    });
  });

  describe("given an invalid password", () => {

  });

  describe("when neither username nor email are provided", () => {

  });

  describe("when no user exists with given username or email", () => {

  });
});