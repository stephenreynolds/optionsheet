import request from "supertest";
import app from "../app";
import config from "../config";
import mockDataService from "../data/mockdb/mockDataService";
import routes from "../routes";

beforeAll(() => {
  app.use(mockDataService, routes);
  config.jwt.secret = "test";
});

describe("GET /user", () => {
  describe("when user is authenticated", () => {
    it("should respond with 200 status code", async () => {
      const tokenResponse = await request(app).post("/auth").send({ username: "username", password: "password" });
      const { token } = tokenResponse.body;

      const response = await request(app).get("/user").set({ "x-access-token": token });
      expect(response.status).toEqual(200);
    });
  });
});