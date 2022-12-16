import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user";
import { ErrorType } from "../utils/errors";
import { JSONResponse } from "./dto/response";
import { User } from "../entity/user";

export interface UserHandler {
  register(req: Request, res: Response, next: NextFunction): void;
}
export class UserHandlerImpl implements UserHandler {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const reqBody: User = {
        name: req.body?.name ?? null,
        email: req.body?.email ?? null,
        username: req.body?.username ?? null,
        password: req.body?.password ?? null,
      };

      await this.userService.register(reqBody);
      res.status(200).json({ message: "OK" } as JSONResponse);
    } catch (e) {
      next(e);
    }
  }
}
