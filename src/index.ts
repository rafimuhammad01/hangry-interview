import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import createError from "http-errors";
import { healthHandler } from "./handler/health";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// TODO: Routing aplikasi akan kita tulis di sini
app.get("/health", healthHandler);

// handle 404 error
app.use((req: Request, res: Response, next: Function) => {
  next(createError(404));
});

app.listen(process.env.PORT, () =>
  console.log(
    `⚡️[server]: Server is running at https://localhost:${process.env.PORT}`
  )
);
