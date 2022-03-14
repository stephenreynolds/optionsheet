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

describe("POST /projects/:username/:project", () => {
  describe("given valid username, project name, and body", () => {
    it("should respond with 201 status code", async () => {
      const body = { symbol: "symbol", openDate: new Date(), legs: [{ side: "Buy", quantity: 1, openPrice: 0 }] };
      const response = await request(app)
        .post("/projects/username/project")
        .send(body)
        .set({ "x-access-token": token });
      expect(response.status).toEqual(201);
    });
  });

  describe("if no user exists with the given username", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app)
        .post("/projects/undefined/project")
        .set({ "x-access-token": token });
      expect(response.status).toEqual(400);
    });
  });

  describe("if no project exists with the given name", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app)
        .post("/projects/username/undefined")
        .set({ "x-access-token": token });
      expect(response.status).toEqual(400);
    });
  });

  describe("if no trade body is provided", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app)
        .post("/projects/username/project")
        .set({ "x-access-token": token });
      expect(response.status).toEqual(400);
    });
  });

  describe("if no symbol was provided", () => {
    it("should respond with 400 status code", async () => {
      const body = { openDate: new Date(), legs: [{ side: "Buy", quantity: 1, openPrice: 0 }] };
      const response = await request(app)
        .post("/projects/username/project")
        .send(body)
        .set({ "x-access-token": token });
      expect(response.status).toEqual(400);
    });
  });

  describe("if no open date was provided", () => {
    it("should respond with 400 status code", async () => {
      const body = { symbol: "symbol", legs: [{ side: "Buy", quantity: 1, openPrice: 0 }] };
      const response = await request(app)
        .post("/projects/username/project")
        .send(body)
        .set({ "x-access-token": token });
      expect(response.status).toEqual(400);
    });
  });

  describe("if no legs were provided", () => {
    it("should respond with 400 status code", async () => {
      const body = { symbol: "symbol", openDate: new Date() };
      const response = await request(app)
        .post("/projects/username/project")
        .send(body)
        .set({ "x-access-token": token });
      expect(response.status).toEqual(400);
    });
  });

  describe("if user is not authenticated", () => {
    it("should respond with 401 status code", async () => {
      const response = await request(app)
        .post("/projects/username/project");
      expect(response.status).toEqual(401);
    });
  });
});

describe("PATCH /trades/:id", () => {
  describe("given valid id and body", () => {
    it("should respond with 204 status code", async () => {
      const body = {};
      const response = await request(app)
        .patch("/trades/0")
        .send(body)
        .set({ "x-access-token": token });
      expect(response.status).toEqual(204);
    });
  });

  describe("if user is not authenticated", () => {
    it("should respond with 401 status code", async () => {
      const response = await request(app)
        .patch("/trades/0");
      expect(response.status).toEqual(401);
    });
  });

  describe("if trade with given id does not exist", () => {
    it("should respond with 404 status code", async () => {
      const response = await request(app)
        .patch("/trades/-1")
        .set({ "x-access-token": token });
      expect(response.status).toEqual(404);
    });
  });
});