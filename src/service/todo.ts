import { Todo, ParamConfig, validate } from "../entity/todo";
import { TodoRepository } from "../repository/todo";
import { pagination, Pagination } from "../utils/pagintation";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const STATUS_TODO = 0;
const STATUS_DONE = 1;

export interface TodoService {
    GetAll(config: ParamConfig): Promise<[Todo[], Pagination]>;
    GetByID(id: number): Promise<Todo>;
    Create(todo: Todo): Promise<void>;
    Update(todo: Todo): null;
    Delete(todo: Todo): null;
}

export class TodoServiceImpl implements TodoService {
    repository: TodoRepository;

    constructor(repository: TodoRepository) {
        this.repository = repository;
    }

    async GetAll(config: ParamConfig): Promise<[Todo[], Pagination]> {
        if (!config.limit) {
            config.limit = DEFAULT_LIMIT;
        }

        if (!config.page) {
            config.page = DEFAULT_PAGE;
        }

        const [data, count] = await this.repository.GetAll(config);
        const paginationData = pagination(
            config.limit,
            config.page,
            count,
            config.url,
            config.assingedTo ? `assinged_to=${config.assingedTo}` : undefined
        );

        return [data, paginationData];
    }

    async GetByID(id: number): Promise<Todo> {
        return this.repository.GetById(id);
    }

    Create(todo: Todo): Promise<void> {
        validate(todo, {
            title: true,
            description: true,
            deadline_date: true,
            assigned_to: true,
        });

        const dateNowUTC = new Date();
        const dateNowGMT7 = new Date(
            dateNowUTC.setHours(dateNowUTC.getHours() + 7)
        );

        todo.status = STATUS_TODO;
        todo.created_at = dateNowGMT7;

        return this.repository.Create(todo);
    }

    Update(todo: Todo): null {
        throw new Error("Method not implemented.");
    }

    Delete(todo: Todo): null {
        throw new Error("Method not implemented.");
    }
}
