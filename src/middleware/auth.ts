import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user";
import { JWTService } from "../service/jwt";
import { ErrorType } from "../utils/errors";

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

export class AuthMiddleware {
    jwtService: JWTService;

    constructor(jwtService: JWTService) {
        this.jwtService = jwtService;
    }

    auth = (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw ErrorType.ErrUnauthorized(
                    "authorization header not provided"
                );
            }

            const authHeaderSplit = authHeader.split(" ");
            if (authHeaderSplit.length < 2) {
                throw ErrorType.ErrUnauthorized("token not provided");
            }

            const token = authHeaderSplit[1];
            const payload = this.jwtService.VerifyJWT(token);
            if (payload == null) {
                throw ErrorType.ErrUnauthorized("token is invalid or expired");
            }

            req.user = {
                id: payload.id,
                username: payload.username,
            } as User;

            return next();
        } catch (e) {
            return next(e);
        }
    };
}
