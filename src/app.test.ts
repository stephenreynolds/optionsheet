import request from "supertest";
import app from "./app";
import { StatusCodes } from "http-status-codes";
import config from "./config";

describe("Middleware", () => {
  it("uses rateLimit", async () => {
    let response;
    for (let i = 0; i <= config.rateLimit.max; ++i) {
      response = await request(app).get("/").send();
    }
    expect(response.statusCode).toEqual(StatusCodes.TOO_MANY_REQUESTS);
  });
});