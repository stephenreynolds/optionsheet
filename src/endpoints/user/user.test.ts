import request from "supertest";
import app from "../../app";
import config from "../../config";
import jwt from "jsonwebtoken";
import { UserManager } from "../../data/userManager";
import { Database } from "../../data/database";
import * as users from "../users/users";
import { GetUserDto } from "../users/usersDtos";
import bcrypt from "bcrypt";
import * as fs from "fs";
import { ProjectManager } from "../../data/projectManager";

let authHeader;

beforeAll(async () => {
  config.jwt.secret = "test";

  const token = jwt.sign({}, config.jwt.secret, {
    expiresIn: config.jwt.expiration
  });
  authHeader = { "authorization": `Bearer ${token}` };

  Database.users = new UserManager({});
  Database.projects = new ProjectManager({});
});

describe("GET /user", () => {
  describe("when user is authenticated", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUUID").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(users, "getUserDetails").mockImplementation(() => Promise.resolve({} as GetUserDto));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/user")
        .set(authHeader);
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

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUUID").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .get("/user")
        .set(authHeader);
      expect(response.status).toEqual(500);
    });
  });
});

describe("PATCH /user", () => {
  let getUserDetails;

  beforeAll(() => {
    jest.spyOn(UserManager.prototype, "getUserByUUID").mockImplementation(() => Promise.resolve({}));
    jest.spyOn(UserManager.prototype, "updateUser").mockImplementation(() => Promise.resolve({}));
    getUserDetails = jest.spyOn(users, "getUserDetails").mockImplementation(() => Promise.resolve({} as GetUserDto));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("when changing username", () => {
    describe("if successful", () => {
      it("should respond with 200 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ username: "undefined" })
          .set(authHeader);
        expect(response.status).toEqual(200);
      });

      it("should respond with user details", async () => {
        await request(app)
          .patch("/user")
          .send({ username: "undefined" })
          .set(authHeader);

        expect(getUserDetails).toBeCalled();
      });
    });

    describe("if username is not available", () => {
      beforeAll(() => {
        jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      it("should respond with 400 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ username: "password" })
          .set(authHeader);
        expect(response.status).toEqual(400);
      });
    });
  });

  describe("when changing password", () => {
    describe("if successful", () => {
      beforeAll(() => {
        jest.spyOn(UserManager.prototype, "getUserByUUID").mockImplementation(() => Promise.resolve({
          password_hash: ""
        }));
        jest.spyOn(users, "getUserDetails").mockImplementation(() => Promise.resolve({} as GetUserDto));
        bcrypt.compare = jest.fn(() => Promise.resolve(true));
      });

      afterAll(() => {
        jest.restoreAllMocks();
        bcrypt.compare.restoreMocks();
      });

      it("should respond with 200 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ current_password: "current", password: "Passw0rd!", confirm: "Passw0rd!" })
          .set(authHeader);
        expect(response.status).toEqual(200);
      });
    });

    describe("if password is too weak", () => {
      describe("if password does not contain lowercase letter", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "P@55W0RD" })
            .set(authHeader);
          expect(response.status).toEqual(400);
        });
      });
      describe("if password does not contain uppercase letter", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "p@55w0rd" })
            .set(authHeader);
          expect(response.status).toEqual(400);
        });
      });
      describe("if password does not contain digit", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "P@ssword" })
            .set(authHeader);
          expect(response.status).toEqual(400);
        });
      });
      describe("if password does not contain special character", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "Passw0rd" })
            .set(authHeader);
          expect(response.status).toEqual(400);
        });
      });
      describe("if password is not at least 8 characters long", () => {
        it("should respond with 400 status code", async () => {
          const response = await request(app)
            .patch("/user")
            .send({ password: "P@4s!12" })
            .set(authHeader);
          expect(response.status).toEqual(400);
        });
      });
    });
  });

  describe("when changing email", () => {
    beforeAll(() => {
      jest.spyOn(users, "getUserDetails").mockImplementation(() => Promise.resolve({} as GetUserDto));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    describe("if successful", () => {
      beforeAll(() => {
        jest.spyOn(UserManager.prototype, "getUserByEmail").mockImplementation(() => Promise.resolve(undefined));
      });

      it("should respond with 200 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ email: "undefined@test.com" })
          .set(authHeader);
        expect(response.status).toEqual(200);
      });
    });

    describe("if email is not available", () => {
      beforeAll(() => {
        jest.spyOn(UserManager.prototype, "getUserByEmail").mockImplementation(() => Promise.resolve({}));
      });

      it("should respond with 400 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ email: "test@test.com" })
          .set(authHeader);
        expect(response.status).toEqual(400);
      });
    });

    describe("if email is invalid", () => {
      it("should respond with 400 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ email: "not an email" })
          .set(authHeader);
        expect(response.status).toEqual(400);
      });
    });
  });

  describe("when changing bio", () => {
    beforeAll(() => {
      jest.spyOn(users, "getUserDetails").mockImplementation(() => Promise.resolve({} as GetUserDto));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    describe("if successful", () => {
      it("should respond with 200 status code", async () => {
        const response = await request(app)
          .patch("/user")
          .send({ bio: "" })
          .set(authHeader);
        expect(response.status).toEqual(200);
      });
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(users, "getUserDetails").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .patch("/user")
        .send({ bio: "" })
        .set(authHeader);
      expect(response.status).toEqual(500);
    });
  });
});

describe("DELETE /users", () => {
  beforeAll(() => {
    jest.spyOn(UserManager.prototype, "deleteUser").mockImplementation(() => Promise.resolve());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("delete successful", () => {
    it("should respond with 204 status code", async () => {
      const response = await request(app)
        .delete("/user")
        .set(authHeader);
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

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "deleteUser").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .delete("/user")
        .set(authHeader);
      expect(response.status).toEqual(500);
    });
  });
});

describe("POST /user/avatar", () => {
  beforeAll(() => {
    jest.spyOn(UserManager.prototype, "getUserByUUID").mockImplementation(() => Promise.resolve({
      avatar_url: ""
    }));
    jest.spyOn(UserManager.prototype, "updateUser").mockImplementation(() => Promise.resolve());
    jest.mock("fs", () => {
      return { unlink: jest.fn() };
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("if successful", () => {
    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .post("/user/avatar")
        .set(authHeader);
      expect(response.status).toEqual(200);
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUUID").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .post("/user/avatar")
        .set(authHeader);
      expect(response.status).toEqual(500);
    });
  });
});

describe("GET /user/starred", () => {
  describe("if successful", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUUID").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(UserManager.prototype, "getStarredProjects").mockImplementation(() => Promise.resolve([]));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/user/starred")
        .set(authHeader);
      expect(response.status).toEqual(200);
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUUID").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .get("/user/starred")
        .set(authHeader);
      expect(response.status).toEqual(500);
    });
  });
});

describe("GET /user/starred/:owner/:project", () => {
  describe("given owner does not exist", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 404 status code", async () => {
      const response = await request(app)
        .get("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(404);
    });
  });

  describe("given project does not exist", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(ProjectManager.prototype, "getProjectByName").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 404 status code", async () => {
      const response = await request(app)
        .get("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(404);
    });
  });

  describe("given project not starred", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(ProjectManager.prototype, "getProjectByName").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(UserManager.prototype, "getStarredProject").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 404 status code", async () => {
      const response = await request(app)
        .get("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(404);
    });
  });

  describe("given project is starred", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(ProjectManager.prototype, "getProjectByName").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(UserManager.prototype, "getStarredProject").mockImplementation(() => Promise.resolve({}));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 204 status code", async () => {
      const response = await request(app)
        .get("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(204);
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .get("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(500);
    });
  });
});

describe("PUT /user/starred/:owner/:project", () => {
  describe("given owner does not exist", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 404 status code", async () => {
      const response = await request(app)
        .put("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(404);
    });
  });

  describe("given project does not exist", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(ProjectManager.prototype, "getProjectByName").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 404 status code", async () => {
      const response = await request(app)
        .put("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(404);
    });
  });

  describe("given project exists", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(ProjectManager.prototype, "getProjectByName").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(UserManager.prototype, "starProject").mockImplementation(() => Promise.resolve());
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 204 status code", async () => {
      const response = await request(app)
        .put("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(204);
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .put("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(500);
    });
  });
});

describe("DELETE /user/starred/:owner/:project", () => {
  describe("given owner does not exist", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 204 status code", async () => {
      const response = await request(app)
        .delete("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(204);
    });
  });

  describe("given project does not exist", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(ProjectManager.prototype, "getProjectByName").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 204 status code", async () => {
      const response = await request(app)
        .delete("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(204);
    });
  });

  describe("given project exists", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(ProjectManager.prototype, "getProjectByName").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(UserManager.prototype, "unStarProject").mockImplementation(() => Promise.resolve());
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 204 status code", async () => {
      const response = await request(app)
        .delete("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(204);
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getUserByUsername").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .delete("/user/starred/test/test")
        .set(authHeader);
      expect(response.status).toEqual(500);
    });
  });
});

describe("PUT /user/pinned", () => {
  describe("given a project does not exist", () => {
    beforeAll(() => {
      jest.spyOn(ProjectManager.prototype, "getProjectById").mockImplementation(() => Promise.resolve(undefined));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 404 status code", async () => {
      const response = await request(app)
        .put("/user/pinned")
        .set(authHeader)
        .send({ projectIds: [0] });
      expect(response.status).toEqual(404);
    });
  });

  describe("if successful", () => {
    beforeAll(() => {
      jest.spyOn(ProjectManager.prototype, "getProjectById").mockImplementation(() => Promise.resolve({}));
      jest.spyOn(UserManager.prototype, "setPinnedProjects").mockImplementation(() => Promise.resolve([]));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 404 status code", async () => {
      const response = await request(app)
        .put("/user/pinned")
        .set(authHeader)
        .send({ projectIds: [0] });
      expect(response.status).toEqual(200);
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(ProjectManager.prototype, "getProjectById").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .put("/user/pinned")
        .set(authHeader)
        .send({ projectIds: [0] });
      expect(response.status).toEqual(500);
    });
  });
});

describe("GET /user/settings", () => {
  describe("if successful", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getDefaultProjectSettings").mockImplementation(() => Promise.resolve({}));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 200 status code", async () => {
      const response = await request(app)
        .get("/user/settings")
        .set(authHeader);
      expect(response.status).toEqual(200);
    });
  });

  describe("when an unknown error occurs", () => {
    beforeAll(() => {
      jest.spyOn(UserManager.prototype, "getDefaultProjectSettings").mockImplementation(() => {
        throw Error();
      });
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should respond with 500 status code", async () => {
      const response = await request(app)
        .get("/user/settings")
        .set(authHeader);
      expect(response.status).toEqual(500);
    });
  });
});