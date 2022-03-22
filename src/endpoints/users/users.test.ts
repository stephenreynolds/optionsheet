import request from "supertest";
import app from "../../app";
import config from "../../config";
import mockDataService from "../../data/mockdb/mockDataService";
import routes from "../../routes";

beforeAll(() => {
  app.use(mockDataService, routes);
  config.jwt.secret = "test";
});

describe("/POST /users", () => {
  describe("given valid credentials", () => {
    it("should respond with 200 status code", async () => {
      const credentials = {
        username: "undefined",
        email: "undefined@test.com",
        password: "Passw0rd!",
        confirm: "Passw0rd!"
      };
      const response = await request(app).post("/users").send(credentials);
      expect(response.status).toEqual(200);
    });
  });
});