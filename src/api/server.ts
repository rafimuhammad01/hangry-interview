import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import { UserHandler, UserHandlerImpl } from "../handler/user";
import { UserRepository, UserRepositoryImpl } from "../repository/user";
import { UserService, UserServiceImpl } from "../service/user";
import { initRouter } from "./route";

type Repository = {
    userRepository: UserRepository;
};

type Service = {
    userService: UserService;
};

export type Handler = {
    userHandler: UserHandler;
};

export class Server {
    prisma: PrismaClient;
    repository: Repository;
    service: Service;
    handler: Handler;
    salt: string;
    app: Express;

    constructor(salt: string) {
        this.app = express();
        this.salt = salt;
        this.prisma = new PrismaClient();
        this.repository = this.initRepository();
        this.service = this.initService();
        this.handler = this.initHandler();
    }

    router(): Express {
        return initRouter(this.app, this.handler);
    }

    private initRepository(): Repository {
        return {
            userRepository: new UserRepositoryImpl(this.prisma),
        };
    }

    private initService(): Service {
        const saltInt = parseInt(this.salt);
        return {
            userService: new UserServiceImpl(
                this.repository.userRepository,
                saltInt
            ),
        };
    }

    private initHandler(): Handler {
        return {
            userHandler: new UserHandlerImpl(this.service.userService),
        };
    }
}
