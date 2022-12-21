import { Prisma, PrismaClient } from "@prisma/client";
import { Todo, ParamConfig } from "../entity/todo";

export interface TodoRepository {
    GetAll(config: ParamConfig): Promise<[Todo[], number]>;
    Create(todo: Todo): Promise<void>;
}

export class TodoRepositoryImpl implements TodoRepository {
    db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    async GetAll(config: ParamConfig): Promise<[Todo[], number]> {
        const offset = (config.limit as number) * ((config.page as number) - 1);
        const count = await this.db.todo.count({
            where: {
                assinged_to_id: (config.assingedTo as number) ?? null,
            },
        });

        const data = await this.db.todo.findMany({
            take: config.limit,
            skip: offset,
            where: {
                assinged_to_id: (config.assingedTo as number) ?? null,
            },
            select: {
                id: true,
                title: true,
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
                created_by_id: todo.created_by?.id as number,
                assinged_to_id: todo.assigned_to?.id as number,
                created_at: todo.created_at,
            } as Prisma.todoUncheckedCreateInput,
        });
    }
}
