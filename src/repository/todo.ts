import { Prisma, PrismaClient } from "@prisma/client";
import { Todo, ParamConfig } from "../entity/todo";

export interface TodoRepository {
    GetAll(config: ParamConfig): Promise<[Todo[], number]>;
    Create(todo: Todo): Promise<void>;
    GetById(id: number): Promise<Todo>;
    Delete(id: number): Promise<void>;
    UpdateStatus(id: number, status: number): Promise<void>;
}

export class TodoRepositoryImpl implements TodoRepository {
    db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    async UpdateStatus(id: number, status: number): Promise<void> {
        await this.db.todo.update({
            where: {
                id: id,
            },
            data: {
                status: status,
            },
        });
    }

    async Delete(id: number): Promise<void> {
        await this.db.todo.delete({
            where: {
                id: id,
            },
        });
    }

    async GetAll(config: ParamConfig): Promise<[Todo[], number]> {
        const offset = (config.limit as number) * ((config.page as number) - 1);
        const count = await this.db.todo.count({
            where: {
                assigned_to_user_id: (config.assingedTo as number) ?? undefined,
            },
        });

        const data = await this.db.todo.findMany({
            take: config.limit,
            skip: offset,
            where: {
                assigned_to_user_id: (config.assingedTo as number) ?? undefined,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                deadline_date: true,
                assigned_to: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
                created_by: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
                created_at: true,
            },
        });

        return [data, count];
    }

    async Create(todo: Todo): Promise<void> {
        await this.db.todo.create({
            data: {
                title: todo.title as string,
                description: todo.title as string,
                status: todo.status as number,
                deadline_date: todo.deadline_date as Date,
                created_by_user_id: todo.created_by?.id as number,
                assigned_to_user_id: todo.assigned_to
                    ? null
                    : (todo.assigned_to.id as number),
                created_at: todo.created_at,
            } as Prisma.todoUncheckedCreateInput,
        });
    }

    async GetById(id: number): Promise<Todo> {
        const data = await this.db.todo.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                deadline_date: true,
                assigned_to: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
                created_by: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
                created_at: true,
            },
        });

        return data;
    }
}
