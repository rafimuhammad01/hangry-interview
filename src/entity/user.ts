import { ErrorType } from "../utils/errors";

export type User = {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    posts?: undefined;
};

export type ValidateConfig = {
    [key in keyof User]: boolean;
};

export const validate = (user: User, config: ValidateConfig): void => {
    const tesFunc = (key: keyof User) => {
        if (user[key]) {
            if (!user[key]) {
                throw ErrorType.ErrValidation(`${key} should not be empty`);
            }
        }
    };
    Object.keys(config).forEach((key) => tesFunc(key as keyof User));
};
