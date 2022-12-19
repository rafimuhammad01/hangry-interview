import { Express, Router } from "express";
import { Handler } from "./server";

export const initRouter = (app: Express, handler: Handler) => {
    app.post("/register", (req, res, next) => {
        handler.userHandler.register(req, res, next);
    });

    return app;
};
