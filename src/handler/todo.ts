import { NextFunction, Request, Response } from "express";
import { Todo } from "../entity/todo";
import { TodoService } from "../service/todo";
import { JSONResponse } from "./dto/response";
import { parse, isValid } from "date-fns";

export interface TodoHandler {
    GetAll(req: Request, res: Response, next: NextFunction): void;
    Create(req: Request, res: Response, next: NextFunction): void;
    GetByID(req: Request, res: Response, next: NextFunction): void;
}

export class TodoHandlerImpl implements TodoHandler {
    todoService: TodoService;

    constructor(todoService: TodoService) {
        this.todoService = todoService;
    }

    async GetByID(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.todoService.GetByID(
                parseInt(req.params.id as string)
            );
            return res.json({
                message: "OK",
                data: data,
            } as JSONResponse);
        } catch (e) {
            return next(e);
        }
    }

    async GetAll(req: Request, res: Response, next: NextFunction) {
        try {
            const assinged_to_id = req.query.assigned_to as string;
            const limit = req.query.limit as string;
            const page = req.query.page as string;
            const url = req.url.split("?")[0];

            const [resp, paginate] = await this.todoService.GetAll({
                limit: limit ? parseInt(limit) : undefined,
                page: page ? parseInt(page) : undefined,
                assingedTo: assinged_to_id
                    ? parseInt(assinged_to_id)
                    : undefined,
                url: url,
            });

            return res.json({
                message: "OK",
                data: {
                    todo: resp,
                    pagination: paginate,
                },
            } as JSONResponse);
        } catch (e) {
            return next(e);
        }
    }

    async Create(req: Request, res: Response, next: NextFunction) {
        try {
            let deadlineDateFormat = parse(
                req.body.deadline_date,
                "yyyy-MM-dd HH:mm:ss",
                new Date()
            );

            const deadlineDateFormatGMT7 = new Date(
                deadlineDateFormat.setHours(deadlineDateFormat.getHours() + 7)
            );

            const isValidDate = isValid(deadlineDateFormat);
            if (!isValidDate) {
                deadlineDateFormat = undefined;
            }

            const todo: Todo = {
                title: req.body.title,
                description: req.body.description,
                deadline_date: deadlineDateFormatGMT7,
                assigned_to: {
                    id: req.body.assigned_to?.id,
                },
                created_by: req.user,
            };

            await this.todoService.Create(todo);
            return res.json({
                message: "OK",
            } as JSONResponse);
        } catch (e) {
            next(e);
        }
    }
}
