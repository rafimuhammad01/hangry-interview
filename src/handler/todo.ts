import { NextFunction, Request, Response } from "express";
import { Todo } from "../entity/todo";
import { TodoService } from "../service/todo";
import { JSONResponse } from "./dto/response";
import { format, parse, isValid } from "date-fns";
import { id } from "date-fns/locale";

export interface TodoHandler {
    GetAll(req: Request, res: Response, next: NextFunction): void;
    Create(req: Request, res: Response, next: NextFunction): void;
}

export class TodoHandlerImpl implements TodoHandler {
    todoService: TodoService;

    constructor(todoService: TodoService) {
        this.todoService = todoService;
    }

    async GetAll(req: Request, res: Response, next: NextFunction) {
        res.json({
            user: req.user,
        });
    }

    async Create(req: Request, res: Response, next: NextFunction) {
        try {
            let deadlineDateFormat = parse(
                req.body.deadline_date,
                "yyyy-MM-dd HH:mm:ss",
                new Date()
            ) as Date | undefined;

            const isValidDate = isValid(deadlineDateFormat);
            if (!isValidDate) {
                deadlineDateFormat = undefined;
            }

            const todo: Todo = {
                title: req.body.title,
                description: req.body.description,
                deadline_date: deadlineDateFormat,
                assigned_to: {
                    id: req.body.assigned_to?.id,
                },
                created_by: req.user,
            };

            await this.todoService.Create(todo);
            res.json({
                message: "OK",
            } as JSONResponse);
        } catch (e) {
            next(e);
        }
    }
}
