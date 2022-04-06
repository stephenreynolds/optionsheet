import request from "supertest";
import app from "../../app";
import config from "../../config";
import routes from "../../routes";
import mockDataService from "../../data/mock/dataService";
import { MockUserManager } from "../../data/mock/userManager";
import bcrypt from "bcrypt";

beforeAll(() => {
  app.use(mockDataService, routes);
  config.jwt.secret = "test";
});

describe("POST /auth", () => {
  describe("given valid credentials", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(MockUserManager.prototype, "createToken").mockImplementation(() => Promise.resolve(""));
      jest.spyOn(MockUserManager.prototype, "createRefreshToken").mockImplementation(() => Promise.resolve({ refresh_token: "" }));
      bcrypt.compare = jest.fn(() => true);
    });

    afterAll(() => {
      jest.restoreAllMocks();
      bcrypt.compare.mockRestore();
    });

    it("should respond with 200 status code", async () => {
      const credentials = { username: "username", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(200);
    });

    it("should respond with an access token", async () => {
      const credentials = { username: "username", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.body.token).toBeDefined();
    });

    it("should respond with a refresh token", async () => {
      const credentials = { username: "username", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.body.refresh_token).toBeDefined();
    });
  });

  describe("given an invalid password", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({
        password_hash: "test"
      }));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 401 status code", async () => {
      const credentials = { username: "username", password: "invalid" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(401);
    });
  });

  describe("when neither username nor email are provided", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app).post("/auth").send();
      expect(response.status).toEqual(400);
    });
  });

  describe("when no password is provided", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 400 status code", async () => {
      const credentials = { username: "username" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(400);
    });
  });

  describe("when no user exists with given username", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 404 status code", async () => {
      const credentials = { username: "undefined", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(404);
    });
  });

  describe("when no user exists with given email", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByEmail").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 404 status code", async () => {
      const credentials = { email: "undefined@test.com", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(404);
    });
  });
});

describe("POST /auth/refresh", () => {
  describe("given valid refresh token", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getRefreshToken").mockImplementation(() => Promise.resolve({
        refresh_token: "test",
        refresh_token_expiry: Infinity
      }));

      jest.spyOn(MockUserManager.prototype, "createTokenFromRefreshToken").mockImplementation(() => Promise.resolve(""));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 200 status code", async () => {
      const response = await request(app).post("/auth/refresh").send({ refresh_token: "token" });
      expect(response.status).toEqual(200);
    });

    it("should respond with an access token", async () => {
      const response = await request(app).post("/auth/refresh").send({ refresh_token: "token" });
      expect(response.body.token).toBeDefined();
    });

    it("should respond with a refresh token", async () => {
      const response = await request(app).post("/auth/refresh").send({ refresh_token: "token" });
      expect(response.body.refresh_token).toBeDefined();
    });
  });

  describe("when refresh token not provided", () => {
    it("should respond with 403 status code", async () => {
      const response = await request(app).post("/auth/refresh").send();
      expect(response.status).toEqual(403);
    });
  });

  describe("when refresh token is invalid", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getRefreshToken").mockImplementation(() => Promise.resolve({
        refresh_token: undefined
      }));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 403 status code", async () => {
      const response = await request(app).post("/auth/refresh").send({ refresh_token: "invalid" });
      expect(response.status).toEqual(403);
    });
  });

  describe("when refresh token is expired", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getRefreshToken").mockImplementation(() => Promise.resolve({
        refresh_token: "test",
        refresh_token_expiry: 0
      }));

      jest.spyOn(MockUserManager.prototype, "createTokenFromRefreshToken").mockImplementation(() => Promise.resolve(""));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 403 status code", async () => {
      const response = await request(app).post("/auth/refresh").send({ refresh_token: "expired" });
      expect(response.status).toEqual(403);
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getRefreshToken").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app).post("/auth/refresh").send({ refresh_token: "test" });
      expect(response.status).toEqual(500);
    });
  });
});

describe("GET /auth/check-credentials", () => {
  describe("when username is available", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 204 status code", async () => {
      const response = await request(app).get("/auth/check-credentials?username=test").send();
      expect(response.status).toEqual(204);
    });
  });

  describe("when email is available", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByEmail").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 204 status code", async () => {
      const response = await request(app).get("/auth/check-credentials?email=test@test.com").send();
      expect(response.status).toEqual(204);
    });
  });

  describe("when username is not available", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 400 status code", async () => {
      const response = await request(app).get("/auth/check-credentials?username=test").send();
      expect(response.status).toEqual(400);
    });
  });

  describe("when email is not available", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByEmail").mockImplementation(() => Promise.resolve({}));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 400 status code", async () => {
      const response = await request(app).get("/auth/check-credentials?email=test@test.com").send();
      expect(response.status).toEqual(400);
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(MockUserManager.prototype, "getUserByUsername").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app).get("/auth/check-credentials?username=test").send();
      expect(response.status).toEqual(500);
    });
  });
});