import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";
import { TokenExpiredError } from "jsonwebtoken";

export class ErrorType extends Error {
    type: string;
    message: string;

    constructor(type: string, message: string) {
        super(type);
        this.type = type;
        this.message = message;
    }

    static ErrValidation(message: string): ErrorType {
        return new ErrorType("input validation error", message);
    }

    static ErrNotFound(message: string): ErrorType {
        return new ErrorType("data not found", message);
    }

    static ErrUnauthorized(message: string): ErrorType {
        return new ErrorType("unauthorized", message);
    }

    static ErrForbidden(message: string): ErrorType {
        return new ErrorType("forbidden", message);
    }
}

export const errorHandler: ErrorRequestHandler = (
    e: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (e instanceof SyntaxError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            message: e.name,
            error: e.message,
        });
    }

    if (e instanceof TokenExpiredError) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            message: "unauthrized",
            error: "token is invalid or expired",
        });
    }

    let err = e as ErrorType;
    if (err.type == ErrorType.ErrValidation("").type) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            error: err.type,
            message: err.message,
        });
    }

    if (err.type == ErrorType.ErrNotFound("").type) {
        return res.status(HttpStatus.NOT_FOUND).json({
            error: err.type,
            message: err.message,
        });
    }

    if (err.type == ErrorType.ErrUnauthorized("").type) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            error: err.type,
            message: err.message,
        });
    }

    if (err.type == ErrorType.ErrForbidden("").type) {
        return res.status(HttpStatus.FORBIDDEN).json({
            error: err.type,
            message: err.message,
        });
    }

    console.log(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "internal server error",
    });
};
