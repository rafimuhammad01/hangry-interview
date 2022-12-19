import { ErrorType } from "../utils/errors";

export type User = {
    id?: number;
    name: string;
    username: string;
    email: string;
    password: string;
    posts?: undefined;
};

export const validate = (user: User): void => {
    if (!user.username) {
        throw ErrorType.ErrValidation("username should not be empty");
    }

    if (!user.name) {
        throw ErrorType.ErrValidation("name should not be emtpy");
    }

    if (!user.password) {
        throw ErrorType.ErrValidation("password should not be empty");
    }
};
