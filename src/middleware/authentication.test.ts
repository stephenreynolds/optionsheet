import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import config from "../config";
import { verifyJwtToken } from "./authentication";
import bcrypt from "bcrypt";

let token;

beforeAll(async () => {
  app.use("/test", verifyJwtToken, (req, res) => res.sendStatus(200));
  config.jwt.secret = "test";

  token = `Bearer ${jwt.sign({}, config.jwt.secret, {
    expiresIn: config.jwt.expiration
  })}`;
});

afterAll(() => {
  jest.restoreAllMocks();
  bcrypt.compare.restoreMocks();
});

describe("verifyJwtToken", () => {
  describe("if token valid", () => {
    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/test")
        .set({ "authorization": token });

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
        .set({ "authorization": "Bearer invalid" });

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
        .set({ "authorization": `Bearer ${expiredToken}` });

      expect(response.status).toEqual(401);
    });
  });

  describe("if an unknown error occurs", () => {
    it("should respond with 500 status code", async () => {
      jwt.verify = jest.fn(() => {
        throw new Error();
      });

      const response = await request(app)
        .get("/test")
        .set({ "authorization": token });

      expect(response.status).toEqual(500);
    });
  });
});