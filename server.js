import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";

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
