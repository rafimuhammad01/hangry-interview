import { Todo, ParamConfig, validate } from "../entity/todo";
import { TodoRepository } from "../repository/todo";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const STATUS_TODO = 0;
const STATUS_DONE = 1;

export interface TodoService {
    GetAll(config: ParamConfig): Todo[];
    GetByID(id: number): Todo;
    Create(todo: Todo): Promise<void>;
    Update(todo: Todo): null;
    Delete(todo: Todo): null;
}

export class TodoServiceImpl implements TodoService {
    repository: TodoRepository;

    constructor(repository: TodoRepository) {
        this.repository = repository;
    }

    GetAll(config: ParamConfig): Todo[] {
        if (!config.limit) {
            config.limit = DEFAULT_LIMIT;
        }

        if (!config.page) {
            config.page = DEFAULT_PAGE;
        }

        return this.repository.GetAll(config);
    }

    GetByID(id: number): Todo {
        throw new Error("Method not implemented.");
    }

    Create(todo: Todo): Promise<void> {
        validate(todo, {
            title: true,
            description: true,
            deadline_date: true,
            assigned_to: true,
        });

        todo.status = STATUS_TODO;
        todo.created_at = new Date();

        return this.repository.Create(todo);
    }

    Update(todo: Todo): null {
        throw new Error("Method not implemented.");
    }

    Delete(todo: Todo): null {
        throw new Error("Method not implemented.");
    }
}
