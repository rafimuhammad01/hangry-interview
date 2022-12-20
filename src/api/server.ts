import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import { InitRedis, RedisClientInternal } from "../database/redis";
import { UserHandler, UserHandlerImpl } from "../handler/user";
import { UserRepository, UserRepositoryImpl } from "../repository/user";
import { JWTService, JWTServiceImpl } from "../service/jwt";
import { UserService, UserServiceImpl } from "../service/user";
import { initRouter } from "./route";
import { Env } from "../config";
import { JWTRepository, JWTRepositoryImpl } from "../repository/jwt";
import { AuthMiddleware } from "../middleware/auth";
import { TodoHandler, TodoHandlerImpl } from "../handler/todo";

type Repository = {
    userRepository: UserRepository;
    JWTRepository: JWTRepository;
};

type Service = {
    userService: UserService;
    JWTService: JWTService;
};

export type Handler = {
    userHandler: UserHandler;
    todoHandler: TodoHandler;
};

export type Middleware = {
    authMiddleware: AuthMiddleware;
};

export class Server {
    prisma: PrismaClient;
    redis: Promise<RedisClientInternal>;
    repository: Repository;
    service: Service;
    handler: Handler;
    middleware: Middleware;
    app: Express;
    config: Env;

    constructor(configEnv: Env) {
        this.app = express();
        this.config = configEnv;
        this.prisma = new PrismaClient();
        this.redis = InitRedis(this.config.REDIS_URL);
        this.repository = this.initRepository();
        this.service = this.initService();
        this.middleware = this.initMiddleware();
        this.handler = this.initHandler();
    }

    router(): Express {
        return initRouter(this.app, this.handler, this.middleware);
    }

    private initMiddleware(): Middleware {
        return {
            authMiddleware: new AuthMiddleware(this.service.JWTService),
        };
    }

    private initRepository(): Repository {
        return {
            userRepository: new UserRepositoryImpl(this.prisma),
            JWTRepository: new JWTRepositoryImpl(this.redis),
        };
    }

    private initService(): Service {
        const JWTService = new JWTServiceImpl(
            this.config.JWT_SECRET,
            this.config.ACCESS_TOKEN_EXP,
            this.config.REFRESH_TOKEN_EXP,
            this.repository.JWTRepository
        );
        return {
            userService: new UserServiceImpl(
                this.repository.userRepository,
                this.config.SALT,
                JWTService
            ),
            JWTService: JWTService,
        };
    }

    private initHandler(): Handler {
        return {
            userHandler: new UserHandlerImpl(this.service.userService),
            todoHandler: new TodoHandlerImpl(),
        };
    }
}
