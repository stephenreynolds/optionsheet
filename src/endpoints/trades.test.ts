import request from "supertest";
import app from "../app";
import config from "../config";
import mockDataService from "../data/mockdb/mockDataService";
import routes from "../routes";

let token;

beforeAll(async () => {
  app.use(mockDataService, routes);
  config.jwt.secret = "test";

  const tokenResponse = await request(app)
    .post("/auth")
    .send({ username: "username", password: "password" });
  token = tokenResponse.body.token;
});

describe("GET /projects/:username/:project/trades", () => {
  describe("given valid username and project name", () => {
    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/projects/username/project/trades");
      expect(response.status).toEqual(200);
    });

    describe("if the project has no trades", () => {
      it("should respond with an empty array", async () => {
        const response = await request(app)
          .get("/projects/username/empty/trades");
        expect(response.body).toHaveLength(0);
      });
    });

    describe("if the project has trades", () => {
      it("should respond with an array of trades", async () => {
        const response = await request(app)
          .get("/projects/username/project/trades");
        expect(response.body.length).toBeGreaterThan(0);
      });
    });
  });

  describe("if no user exists with the given username", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app)
        .get("/projects/undefined/project/trades");
      expect(response.status).toEqual(400);
    });
  });

  describe("if no project exists with the given name", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app)
        .get("/projects/username/undefined/trades");
      expect(response.status).toEqual(400);
    });
  });
});

describe("GET /trades/:id", () => {
  describe("given valid id", () => {
    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/trades/0");
      expect(response.status).toEqual(200);
    });

    it("should respond with a trade object", async () => {
      const response = await request(app)
        .get("/trades/0");
      expect(response.body.legs).toBeDefined();
    });
  });

  describe("given an invalid id", () => {
    it("should respond with 404 status code", async () => {
      const response = await request(app)
        .get("/trades/-1");
      expect(response.status).toEqual(404);
    });
  });
});