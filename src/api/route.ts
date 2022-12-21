import { Express, NextFunction, Request, Response, Router } from "express";
import { Handler, Middleware } from "./server";

export const initRouter = (
    app: Express,
    handler: Handler,
    middleware: Middleware
) => {
    app.post("/register", (req, res, next) => {
        handler.userHandler.register(req, res, next);
    });

    app.post("/login", (req, res, next) => {
        handler.userHandler.login(req, res, next);
    });

    app.get(
        "/todo",
        (req, res, next) => {
            middleware.authMiddleware.auth(req, res, next);
        },
        (req, res, next) => {
            handler.todoHandler.GetAll(req, res, next);
        }
    );

    app.post(
        "/todo",
        (req, res, next) => {
            middleware.authMiddleware.auth(req, res, next);
        },
        (req, res, next) => {
            handler.todoHandler.Create(req, res, next);
        }
    );

    app.get(
        "/todo/:id",
        (req, res, next) => {
            middleware.authMiddleware.auth(req, res, next);
        },
        (req, res, next) => {
            handler.todoHandler.GetByID(req, res, next);
        }
    );

    return app;
};
