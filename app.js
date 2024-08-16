import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const DB_HOST =
  "mongodb+srv://veronikalife:wCR_D-Ngj4H4GYt@cluster0.flu8f.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    console.log("Database connect success");
    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
