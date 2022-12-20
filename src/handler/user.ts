import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user";
import { ErrorType } from "../utils/errors";
import { JSONResponse } from "./dto/response";
import { User } from "../entity/user";

export interface UserHandler {
    register(req: Request, res: Response, next: NextFunction): void;
    login(req: Request, res: Response, next: NextFunction): void;
}
export class UserHandlerImpl implements UserHandler {
    userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const reqBody: User = {
                name: req.body?.name,
                email: req.body?.email,
                username: req.body?.username,
                password: req.body?.password,
            };

            await this.userService.register(reqBody);
            return res.status(200).json({ message: "OK" } as JSONResponse);
        } catch (e) {
            return next(e);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const reqBody: User = {
                email: req.body?.email,
                username: req.body?.username,
                password: req.body?.password,
            };

            const token = await this.userService.login(reqBody);

            return res.status(200).json({
                message: "OK",
                data: token,
            } as JSONResponse);
        } catch (e) {
            return next(e);
        }
    }
}
