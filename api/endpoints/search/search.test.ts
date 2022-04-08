import { Database } from "../../data/database";
import { ProjectManager } from "../../data/projectManager";
import { TradeManager } from "../../data/tradeManager";
import { UserManager } from "../../data/userManager";
import request from "supertest";
import app from "../../app";

beforeAll(() => {
  Database.trades = new TradeManager({});
  Database.projects = new ProjectManager({});
  Database.users = new UserManager({});
  jest.spyOn(TradeManager.prototype, "getTradeMatches").mockImplementation(() => Promise.resolve(0));
  jest.spyOn(ProjectManager.prototype, "getProjectMatches").mockImplementation(() => Promise.resolve(0));
  jest.spyOn(UserManager.prototype, "getUserMatches").mockImplementation(() => Promise.resolve(0));
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("GET /search", () => {
  describe("given no type", () => {
    it("should call getTradesBySymbol", async () => {
      const getTradesBySymbol = jest.spyOn(TradeManager.prototype, "getTradesBySymbol").mockImplementation(() => Promise.resolve([]));
      await request(app).get("/search?q=test");
      expect(getTradesBySymbol).toBeCalled();
    });

    it("should respond with 200 status code", async () => {
      jest.spyOn(TradeManager.prototype, "getTradesBySymbol").mockImplementation(() => Promise.resolve([]));
      const response = await request(app).get("/search?q=test");
      expect(response.status).toEqual(200);
    });
  });

  describe("given trade type", () => {
    it("should call getTradesBySymbol", async () => {
      const getTradesBySymbol = jest.spyOn(TradeManager.prototype, "getTradesBySymbol").mockImplementation(() => Promise.resolve([]));
      await request(app).get("/search?q=test&type=trade");
      expect(getTradesBySymbol).toBeCalled();
    });

    it("should respond with 200 status code", async () => {
      jest.spyOn(TradeManager.prototype, "getTradesBySymbol").mockImplementation(() => Promise.resolve([]));
      const response = await request(app).get("/search?q=test");
      expect(response.status).toEqual(200);
    });
  });

  describe("given project type", () => {
    it("should call getProjectsByName", async () => {
      const getProjectsByName = jest.spyOn(ProjectManager.prototype, "getProjectsByName").mockImplementation(() => Promise.resolve([]));
      await request(app).get("/search?q=test&type=project");
      expect(getProjectsByName).toBeCalled();
    });

    it("should respond with 200 status code", async () => {
      jest.spyOn(ProjectManager.prototype, "getProjectsByName").mockImplementation(() => Promise.resolve([]));
      const response = await request(app).get("/search?q=test&type=project");
      expect(response.status).toEqual(200);
    });
  });

  describe("given user type", () => {
    it("should call getUsersByUsername", async () => {
      const getUsersByUsername = jest.spyOn(UserManager.prototype, "getUsersByUsername").mockImplementation(() => Promise.resolve([]));
      await request(app).get("/search?q=test&type=user");
      expect(getUsersByUsername).toBeCalled();
    });

    it("should respond with 200 status code", async () => {
      jest.spyOn(UserManager.prototype, "getUsersByUsername").mockImplementation(() => Promise.resolve([]));
      const response = await request(app).get("/search?q=test&type=user");
      expect(response.status).toEqual(200);
    });
  });

  describe("given no term", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app).get("/search");
      expect(response.status).toEqual(400);
    });
  });

  describe("given an unknown error occurs", () => {
    it("should respond with 500 status code", async () => {
      jest.spyOn(TradeManager.prototype, "getTradesBySymbol").mockImplementation(() => {
        throw Error();
      });
      const response = await request(app).get("/search?q=test");
      expect(response.status).toEqual(500);
    });
  });
});