import express from "express";
import dotenv from "dotenv";
import { Server } from "./api/server";
import { errorHandler } from "./utils/errors";
import { Env } from "./config";
import morgan from "morgan";

dotenv.config();
const app = express();

const config = {
    REDIS_URL: process.env.REDIS_URL as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    SALT: parseInt(process.env.SALT as string),
    JWT_SECRET: process.env.JWT_SECRET,
    ACCESS_TOKEN_EXP: parseInt(process.env.ACCESS_TOKEN_EXP as string),
    REFRESH_TOKEN_EXP: parseInt(process.env.REFRESH_TOKEN_EXP as string),
} as Env;

const server = new Server(config);

app.use(morgan("combined"));
app.use(express.json());
app.use(server.router());
app.use(errorHandler);

let PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(
        `⚡️[server]: Server is running at https://localhost:${process.env.PORT}`
    );
});
