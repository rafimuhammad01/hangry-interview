import express, { Request, Response } from "express";
import { userRoute } from "./api/route";

let app = express();
app = userRoute(app)

app.listen(process.env.PORT, () =>
  console.log(
    `⚡️[server]: Server is running at https://localhost:${process.env.PORT}`
  )
);
