import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { WebSocketServer } from "ws";
import contactsRouter from "./routes/contactsRouter.js";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

dotenv.config();

const { DB_HOST, PORT = 3000 } = process.env;

if (!DB_HOST) {
  throw new Error("DB_HOST is not defined in environment variables");
}

const app = express();

const startServer = () => {
  app.use(morgan("tiny"));
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRouter);
  app.use("/api/contacts", contactsRouter);
  app.use(express.static("public"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
  });

  mongoose
    .connect(DB_HOST)
    .then(() => {
      console.log("Database connection successful");
      const server = app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
      });

      const wsServer = new WebSocketServer({ server });
      const socketList = [];

      wsServer.on("connection", (socket) => {
        console.log("New WebSocket connection");

        socketList.push(socket);
        socket.send("Welcome to the WebSocket server");

        socketList.forEach((client) => {
          if (client !== socket && client.readyState === 1) {
            client.send(`Now we have ${socketList.length} members`);
          }
        });

        socket.on("close", () => {
          console.log("WebSocket disconnected");
          const index = socketList.indexOf(socket);
          if (index !== -1) {
            socketList.splice(index, 1);
          }
        });
      });

      const gracefulShutdown = () => {
        server.close(() => {
          console.log("Server shutting down...");
          mongoose.connection.close(() => {
            console.log("Database connection closed");
            process.exit(0);
          });
        });
      };

      process.on("SIGTERM", gracefulShutdown);
      process.on("SIGINT", gracefulShutdown);
    })
    .catch((error) => {
      console.error("Database connection error:", error.message);
      process.exit(1);
    });
};

export default startServer;
