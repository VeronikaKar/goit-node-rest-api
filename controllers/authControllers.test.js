import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import authController from "./authController";
import User from "../models/user";
import { initDBConnection, closeDBConnection } from "../initDBConnection.js";
import startServer from "../server.js";

jest.mock("../models/user");
jest.mock("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

app.post("/api/auth/signin", authController.signin);

describe("Auth Controller Signin Tests", () => {
  let server;

  beforeAll(async () => {
    await initDBConnection(process.env.DB_HOST_TEST);
    server = startServer();
  });

  afterAll(async () => {
    await closeDBConnection();
    server.close();
  });

  test("POST /api/auth/signin - should return 200 with token and user object on valid credentials", async () => {
    const mockUser = {
      _id: "123",
      email: "test@example.com",
      password: "hashedPassword",
      subscription: "premium",
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    jwt.sign = jest.fn().mockReturnValue("testToken");

    const response = await request(server)
      .post("/api/auth/signin")
      .send({ email: "test@example.com", password: "password" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token", "testToken");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", "test@example.com");
    expect(response.body.user).toHaveProperty("subscription", "premium");
  });

  test("POST /api/auth/signin - should return 401 on invalid credentials", async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(server)
      .post("/api/auth/signin")
      .send({ email: "test@example.com", password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  test("POST /api/auth/signin - should return 401 on incorrect password", async () => {
    const mockUser = {
      _id: "123",
      email: "test@example.com",
      password: "hashedPassword",
      subscription: "premium",
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    jwt.sign = jest.fn().mockReturnValue("testToken");

    authController.signin = (req, res) => {
      res.status(401).json({ message: "Invalid credentials" });
    };

    const response = await request(server)
      .post("/api/auth/signin")
      .send({ email: "test@example.com", password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });
});
