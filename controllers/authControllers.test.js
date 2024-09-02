const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const authController = require("./authController");
const User = require("../models/user");

const app = express();
app.use(bodyParser.json());
app.post("/login", authController.login);

jest.mock("../models/user");

describe("POST /login", () => {
  it("should return status 200 and a token and user object when credentials are valid", async () => {
    const mockUser = {
      _id: "123",
      email: "test@example.com",
      password: "password",
      subscription: "premium",
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", "test@example.com");
    expect(response.body.user).toHaveProperty("subscription", "premium");
  });

  it("should return status 401 if credentials are invalid", async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });
});
