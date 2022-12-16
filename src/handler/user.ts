import { user } from "@prisma/client";
import { Request, Response } from "express";
import { UserService } from "../service/user";
import { JSONResponse } from "./dto/response";

class UserHandler {
    userService : UserService

    constructor (userService: UserService) {
        this.userService = userService
    }

    async register(req: Request, res: Response) {
        const reqBody: user = {
            id:0,
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        } 

        this.userService.register(reqBody)
        res.status(200).json({ message: "OK"} as JSONResponse)
    }
}
