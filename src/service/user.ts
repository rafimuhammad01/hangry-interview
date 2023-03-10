import { UserRepository } from "../repository/user";
import { ErrorType } from "../utils/errors";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { User, validate } from "../entity/user";
import { JWTService } from "./jwt";
import { Token } from "../entity/jwt";

export interface UserService {
    register(user: User): Promise<void>;
    login(user: User): Promise<Token | null>;
    refreshToken(token: string): Promise<Token>;
}

export class UserServiceImpl {
    userRepository: UserRepository;
    JWTService: JWTService;
    saltSync: String;

    constructor(
        userRepository: UserRepository,
        salt: number,
        JWTService: JWTService
    ) {
        this.userRepository = userRepository;
        this.saltSync = genSaltSync(salt);
        this.JWTService = JWTService;
    }

    async refreshToken(token: string): Promise<Token> {
        return this.JWTService.RefreshToken(token);
    }

    async register(user: User): Promise<void> {
        // validate user instance
        validate(user, {
            username: true,
            name: true,
            password: true,
            email: false,
        });

        // check if username or email is exist
        const userByUsername = await this.userRepository.getUserByUsername(
            user.username as string
        );
        if (userByUsername) {
            throw ErrorType.ErrValidation("username is already exist");
        }

        if (user.email) {
            const userByEmail = await this.userRepository.getUserByEmail(
                user.email as string
            );

            if (userByEmail) {
                throw ErrorType.ErrValidation("email already exist");
            }
        }

        // hash password
        user.password = hashSync(
            user.password as string,
            this.saltSync as string
        );

        // create user
        await this.userRepository.createUser(user);
    }

    async login(user: User): Promise<Token | null> {
        // validate user input
        validate(user, {
            password: true,
            name: false,
            username: false,
            email: false,
        });

        if (!user.username && !user.email) {
            throw ErrorType.ErrValidation(
                "username or email should not be empty"
            );
        }

        // get user data
        let userData = {} as User | null;
        if (user.email) {
            userData = await this.userRepository.getUserByEmail(user.email);
            if (userData == null) {
                throw ErrorType.ErrValidation("incorrect email/password");
            }
        } else if (user.username) {
            userData = await this.userRepository.getUserByUsername(
                user.username
            );
            if (userData == null) {
                throw ErrorType.ErrValidation("incorrect username/password");
            }
        }

        // matched password
        const isMatched = compareSync(
            user.password as string,
            userData?.password as string
        );

        if (!isMatched) {
            throw ErrorType.ErrValidation("incorrect username/password");
        }

        // generate and return token
        const token = await this.JWTService.GenerateToken({
            id: userData?.id as number,
            username: userData?.username as string,
        });

        return token;
    }
}
