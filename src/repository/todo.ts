import { Prisma, PrismaClient } from "@prisma/client";
import { Todo, ParamConfig } from "../entity/todo";

export interface TodoRepository {
    GetAll(config: ParamConfig): Todo[];
    Create(todo: Todo): Promise<void>;
}

export class TodoRepositoryImpl implements TodoRepository {
    db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    GetAll(config: ParamConfig): Todo[] {
        throw new Error("Method not implemented.");
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
