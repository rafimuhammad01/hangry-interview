import { NextFunction, Request, Response } from "express";

export interface TodoHandler {
    GetAll(req: Request, res: Response, next: NextFunction): void;
}

export class TodoHandlerImpl implements TodoHandler {
    async GetAll(req: Request, res: Response, next: NextFunction) {
        res.json({
            user: req.user,
        });
    }
}
