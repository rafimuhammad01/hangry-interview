import express from "express";
import dotenv from "dotenv";
import { Server } from "./api/server";
import { errorHandler } from "./utils/errors";

dotenv.config();
const app = express();

const server = new Server(process.env.SALT as string);

app.use(express.json());
app.use(server.router());
app.use(errorHandler);

let PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${process.env.PORT}`
  );
});
