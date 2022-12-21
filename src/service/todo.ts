import { Todo, ParamConfig, validate } from "../entity/todo";
import { User } from "../entity/user";
import { TodoRepository } from "../repository/todo";
import { ErrorType } from "../utils/errors";
import { pagination, Pagination } from "../utils/pagintation";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export const STATUS_TODO = 0;
export const STATUS_DONE = 1;

export interface TodoService {
    GetAll(config: ParamConfig): Promise<[Todo[], Pagination]>;
    // GetByID(id: number): Promise<Todo>;
    Create(todo: Todo): Promise<void>;
    UpdateStatus(id: number, status: number, user: User): Promise<void>;
    Delete(id: number, user: User): Promise<void>;
}

export class TodoServiceImpl implements TodoService {
    repository: TodoRepository;

    constructor(repository: TodoRepository) {
        this.repository = repository;
    }

    async UpdateStatus(id: number, status: number, user: User): Promise<void> {
        if (status != STATUS_DONE && status != STATUS_TODO) {
            throw ErrorType.ErrValidation(
                "status is reqired and should be to do or done"
            );
        }

        const data = await this.repository.GetById(id);
        if (!data) {
            throw ErrorType.ErrNotFound(`todo with id=${id} not found`);
        }

        if (data.created_by.id != user.id) {
            throw ErrorType.ErrForbidden("you are forbidden to do this action");
        }

        await this.repository.UpdateStatus(id, status);
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

    // async GetByID(id: number): Promise<Todo> {
    //     const data = await this.repository.GetById(id);
    //     if (!data) {
    //         throw ErrorType.ErrNotFound(`todo with id=${id} not found`);
    //     }
    //     return data;
    // }

    async Create(todo: Todo): Promise<void> {
        validate(todo, {
            title: true,
            description: true,
            deadline_date: true,
        });

        const dateNowUTC = new Date();
        const dateNowGMT7 = new Date(
            dateNowUTC.setHours(dateNowUTC.getHours() + 7)
        );

        todo.status = STATUS_TODO;
        todo.created_at = dateNowGMT7;

        return this.repository.Create(todo);
    }

    async Delete(id: number, user: User): Promise<void> {
        const data = await this.repository.GetById(id);
        if (!data) {
            throw ErrorType.ErrNotFound(`todo with id=${id} not found`);
        }

        if (data.created_by.id != user.id) {
            throw ErrorType.ErrForbidden("you are forbidden to do this action");
        }

        await this.repository.Delete(id);
    }
}
