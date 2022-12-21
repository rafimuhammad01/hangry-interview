import { NextFunction, Request, Response } from "express";
import { Todo } from "../entity/todo";
import { STATUS_DONE, STATUS_TODO, TodoService } from "../service/todo";
import { JSONResponse } from "./dto/response";
import { parse, isValid } from "date-fns";
import { ErrorType } from "../utils/errors";

export interface TodoHandler {
    GetAll(req: Request, res: Response, next: NextFunction): void;
    Create(req: Request, res: Response, next: NextFunction): void;
    UpdateStatus(req: Request, res: Response, next: NextFunction): void;
    Delete(req: Request, res: Response, next: NextFunction): void;
}

export class TodoHandlerImpl implements TodoHandler {
    todoService: TodoService;

    constructor(todoService: TodoService) {
        this.todoService = todoService;
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

            const cleanResp: any = [];
            resp.forEach((val) => {
                let status: string = undefined;
                if (val.status === STATUS_DONE) {
                    status = "done";
                }

                if (val.status === STATUS_TODO) {
                    status = "todo";
                }

                cleanResp.push({
                    ...val,
                    status: status,
                });
            });

            return res.json({
                message: "OK",
                data: {
                    todo: cleanResp,
                    pagination: paginate,
                },
            } as JSONResponse);
        } catch (e) {
            return next(e);
        }
    }

    async Create(req: Request, res: Response, next: NextFunction) {
        try {
            let deadlineDateFormatGMT7 = undefined;
            if (req.body.deadline_date) {
                let deadlineDateFormat = parse(
                    req.body.deadline_date,
                    "yyyy-MM-dd HH:mm:ss",
                    new Date()
                );

                deadlineDateFormatGMT7 = new Date(
                    deadlineDateFormat.setHours(
                        deadlineDateFormat.getHours() + 7
                    )
                );

                const isValidDate = isValid(deadlineDateFormatGMT7);
                if (!isValidDate) {
                    throw ErrorType.ErrValidation(
                        "date format should be yyyy-mm-dd hh:mm:ss"
                    );
                }
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

    async UpdateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            let status = undefined;
            if (req.body.status === "todo") {
                status = STATUS_TODO;
            }

            if (req.body.status === "done") {
                status = STATUS_DONE;
            }

            await this.todoService.UpdateStatus(
                parseInt(req.params.id as string),
                status,
                req.user
            );
            return res.json({
                message: "OK",
            } as JSONResponse);
        } catch (e) {
            next(e);
        }
    }

    async Delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.todoService.Delete(
                parseInt(req.params.id as string),
                req.user
            );

            return res.json({
                message: "OK",
            } as JSONResponse);
        } catch (e) {
            return next(e);
        }
    }
}
