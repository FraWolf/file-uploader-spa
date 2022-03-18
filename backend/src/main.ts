import express from "express";
import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import v1Api from "./routes/v1/index";
import { startDatabase } from "./db/wrapper";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ exposedHeaders: "X-File-Name" }));

// Start v1 api route
app.use("/api/v1", v1Api);

app.all("*", (req, res) => {
  res.status(200).send({ v1: "/api/v1" });
});

app.listen(process.env.WEBSERVER_PORT, () => {
  console.log(`[EXPRESS] Running on port`, process.env.WEBSERVER_PORT);

  // Starting database
  const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
  startDatabase(DB_HOST!, DB_NAME!, DB_USERNAME!, DB_PASSWORD!);
});
