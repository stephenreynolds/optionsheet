import request from "supertest";
import app from "./app";
import mockDataService from "./data/mock/dataService";
import routes from "./routes";

beforeAll(() => {
  app.use(mockDataService, routes);
});

describe("when rate limit exceeded", () => {
  it("should respond with 429 status code", async () => {
    let response;

    for (let i = 0; i <= 1000; ++i) {
      response = await request(app).get("/").send();
    }

    expect(response.status).toEqual(429);
  });
});