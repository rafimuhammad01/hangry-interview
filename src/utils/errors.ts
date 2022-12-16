import debug from "debug";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";

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
}

export const errorHandler: ErrorRequestHandler = (
  e: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let err = e as ErrorType;
  if (err.type == ErrorType.ErrValidation("").type) {
    res.status(HttpStatus.BAD_REQUEST).json({
      error: err.type,
      message: err.message,
    });
  }

  if (err.type == ErrorType.ErrNotFound("").type) {
    res.status(HttpStatus.NOT_FOUND).json({
      error: err.type,
      message: err.message,
    });
  }

  console.log(e);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    error: "internal server error",
  });
};
