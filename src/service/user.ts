import { UserRepository } from "../repository/user";
import { ErrorType } from "../utils/errors";
import { genSaltSync, hashSync } from "bcrypt";
import { User, validate } from "../entity/user";

export interface UserService {
    register(user: User): Promise<void>;
}

export class UserServiceImpl {
    userRepository: UserRepository;
    salt: number;

    constructor(userRepository: UserRepository, salt: number) {
        this.userRepository = userRepository;
        this.salt = salt;
    }

    async register(user: User): Promise<void> {
        // validate user instance
        validate(user);

        // check if username or email is exist
        const userByUsername = await this.userRepository.getUserByUsername(
            user.username
        );
        if (userByUsername) {
            throw ErrorType.ErrValidation("username is already exist");
        }
        const userByEmail = await this.userRepository.getUserByEmail(
            user.email
        );
        if (userByEmail) {
            throw ErrorType.ErrValidation("email already exist");
        }

        // hash password
        user.password = this.hashPassword(user.password);

        // create user
        await this.userRepository.createUser(user);
    }

    private hashPassword(password: string): string {
        const salt = genSaltSync(this.salt);
        return hashSync(password, salt);
    }
}
