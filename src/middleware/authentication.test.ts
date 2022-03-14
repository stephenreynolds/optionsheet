import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import config from "../config";
import mockDataService from "../data/mockdb/mockDataService";
import routes from "../routes";
import { verifyJwtToken } from "./authentication";

let token;

beforeAll(async () => {
  app.use(mockDataService, routes);
  app.use("/test", verifyJwtToken, (req, res) => res.sendStatus(200));
  config.jwt.secret = "test";

  const tokenResponse = await request(app)
    .post("/auth")
    .send({ username: "username", password: "password" });
  token = tokenResponse.body.token;
});

describe("verifyJwtToken", () => {
  describe("if token valid", () => {
    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/test")
        .set({ "x-access-token": token });
      expect(response.status).toEqual(200);
    });
  });

  describe("if token not provided", () => {
    it("should respond with 401 status code", async () => {
      const response = await request(app)
        .get("/test");
      expect(response.status).toEqual(401);
    });
  });

  describe("if token provided but invalid", () => {
    it("should respond with 401 status code", async () => {
      const response = await request(app)
        .get("/test")
        .set({ "x-access-token": "invalid" });
      expect(response.status).toEqual(401);
    });
  });

  describe("if token expired", () => {
    const expiredToken = jwt.sign({}, "test", {
      expiresIn: -1
    });

    it("should respond with 401 status code", async () => {
      const response = await request(app)
        .get("/test")
        .set({ "x-access-token": expiredToken });
      expect(response.status).toEqual(401);
    });
  });
});