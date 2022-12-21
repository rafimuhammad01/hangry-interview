import { ErrorType } from "../utils/errors";
import { User } from "./user";

export type ParamConfig = {
    limit?: number;
    page?: number;
    assingedTo?: number;
    url?: string;
};

export type Todo = {
    id?: number;
    title?: string;
    description?: string;
    status?: number;
    deadline_date?: Date;
    assigned_to?: User;
    created_by?: User;
    created_at?: Date;
};

export type ValidateConfig = {
    [key in keyof Todo]: boolean;
};

export const validate = (todo: Todo, config: ValidateConfig): void => {
    console.log(todo);
    const validateFunc = (key: keyof Todo) => {
        if (config[key]) {
            if (!todo[key]) {
                throw ErrorType.ErrValidation(`${key} should not be empty`);
            }

            if (key === "assigned_to" || key === "created_by") {
                if (!todo[key]?.id) {
                    throw ErrorType.ErrValidation(
                        `${key}.id should not be empty`
                    );
                }
            }
        }
    };

    Object.keys(config).forEach((key) => validateFunc(key as keyof Todo));
};
