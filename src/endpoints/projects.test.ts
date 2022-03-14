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

describe("GET /projects/:username", () => {
  describe("given valid username", () => {
    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/projects/username");
      expect(response.status).toEqual(200);
    });

    describe("given user has no projects", () => {
      it("should respond with an empty array", async () => {
        const response = await request(app)
          .get("/projects/no-projects");
        expect(response.body).toHaveLength(0);
      });
    });

    describe("given user has projects", () => {
      it("should respond with project details", async () => {
        const response = await request(app)
          .get("/projects/username");
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].description).toBeDefined();
        expect(response.body[0].tags).toBeDefined();
        expect(response.body[0].lastEdited).toBeDefined();
      });
    });
  });

  describe("if user does not exist", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app)
        .get("/projects/undefined");
      expect(response.status).toEqual(400);
    });
  });
});

describe("GET /projects/:username/:project", () => {
  describe("given a valid username and project name", () => {
    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/projects/username/project");
      expect(response.status).toEqual(200);
    });

    it("should respond with project details", async () => {
      const response = await request(app)
        .get("/projects/username/project");
      expect(response.body.name).toBeDefined();
      expect(response.body.description).toBeDefined();
      expect(response.body.tags).toBeDefined();
      expect(response.body.lastEdited).toBeDefined();
    });
  });

  describe("when the username is invalid", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app)
        .get("/projects/undefined/project");
      expect(response.status).toEqual(400);
    });
  });

  describe("when the given user does not have a project with given name", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app)
        .get("/projects/username/undefined");
      expect(response.status).toEqual(400);
    });
  });
});