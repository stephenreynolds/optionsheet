import request from "supertest";
import app from "../../app";
import config from "../../config";
import mockDataService from "../../data/mockdb/mockDataService";
import routes from "../../routes";

let token;

beforeAll(async () => {
  app.use(mockDataService, routes);
  config.jwt.secret = "test";

  const tokenResponse = await request(app)
    .post("/auth")
    .send({ username: "username", password: "password" });
  token = tokenResponse.body.token;
});

describe("GET /user", () => {
  describe("when user is authenticated", () => {
    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/user")
        .set({ "x-access-token": token });
      expect(response.status).toEqual(200);
    });
  });

  describe("when user is not authenticated", () => {
    it("should respond with 401 status code", async () => {
      const response = await request(app)
        .get("/user")
        .send();
      expect(response.status).toEqual(401);
    });
  });
});

describe("PATCH /user", () => {
  describe("when changing username", () => {
    describe("if successful", () => {
      it("should respond with 200 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ username: "undefined" })
          .set({ "x-access-token": token });
        expect(response.status).toEqual(200);
      });

      it("should respond with user details", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ username: "undefined" })
          .set({ "x-access-token": token });

        expect(response.body.username).toBeDefined();
        expect(response.body.url).toBeDefined();
        expect(response.body.html_url).toBeDefined();
        expect(response.body.projects_url).toBeDefined();
        expect(response.body.email).toBeDefined();
        expect(response.body.avatar_url).toBeDefined();
        expect(response.body.bio).toBeDefined();
        expect(response.body.created_on).toBeDefined();
        expect(response.body.updated_on).toBeDefined();
        expect(response.body.is_admin).toBeDefined();
      });
    });

    describe("if username is not available", () => {
      it("should respond with 400 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ username: "password" })
          .set({ "x-access-token": token });
        expect(response.status).toEqual(400);
      });
    });
  });

  describe("when changing password", () => {
    describe("if successful", () => {
      it("should respond with 200 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ password: "Pass0rd!" })
          .set({ "x-access-token": token });
        expect(response.status).toEqual(200);
      });
    });

    describe("if password is too weak", () => {
      describe("if password does not contain lowercase letter", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "P@55W0RD" })
            .set({ "x-access-token": token });
          expect(response.status).toEqual(400);
        });
      });
      describe("if password does not contain uppercase letter", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "p@55w0rd" })
            .set({ "x-access-token": token });
          expect(response.status).toEqual(400);
        });
      });
      describe("if password does not contain digit", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "P@ssword" })
            .set({ "x-access-token": token });
          expect(response.status).toEqual(400);
        });
      });
      describe("if password does not contain special character", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "Passw0rd" })
            .set({ "x-access-token": token });
          expect(response.status).toEqual(400);
        });
      });
      describe("if password is not at least 8 characters long", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "P@4s!12" })
            .set({ "x-access-token": token });
          expect(response.status).toEqual(400);
        });
      });
    });
  });

  describe("when changing email", () => {
    describe("if successful", () => {
      it("should respond with 200 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ email: "undefined@test.com" })
          .set({ "x-access-token": token });
        expect(response.status).toEqual(200);
      });
    });

    describe("if email is not available", () => {
      it("should respond with 400 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ email: "test@test.com" })
          .set({ "x-access-token": token });
        expect(response.status).toEqual(400);
      });
    });

    describe("if email is invalid", () => {
      it("should respond with 400 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ email: "not an email" })
          .set({ "x-access-token": token });
        expect(response.status).toEqual(400);
      });
    });
  });

  describe("when changing bio", () => {
    describe("if successful", () => {
      it("should respond with 200 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ bio: "" })
          .set({ "x-access-token": token });
        expect(response.status).toEqual(200);
      });
    });
  });
});

describe("DELETE /users", () => {
  describe("delete successful", () => {
    it("should respond with 204 status code", async () => {
      const response = await request(app)
        .delete("/user")
        .set({ "x-access-token": token });
      expect(response.status).toEqual(204);
    });
  });

  describe("when user not authorized", () => {
    it("should respond with 401 status code", async () => {
      const response = await request(app)
        .delete("/user");
      expect(response.status).toEqual(401);
    });
  });
});