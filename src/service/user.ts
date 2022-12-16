import { user } from "@prisma/client";
import { UserRepository } from "../repository/userRepository";
import { ErrorType } from "../utils/errors";
import { genSaltSync, hashSync } from "bcrypt";

export interface UserService{
  register(user: user): Promise<void>
}

class UserServiceImpl {
  userRepository: UserRepository;
  salt :number 

  constructor(userRepository: UserRepository, salt: number) {
    this.userRepository = userRepository;
    this.salt = salt;
  }

  async register(user: user): Promise<void> {
    // validate user instance
    this.validate(user);

    // check if username or email is exist
    const userByEmail = await this.userRepository.getUserByEmail(user.email);
    if (userByEmail) {
      throw ErrorType.ErrValidation("email already exist");
    }
    const userByUsername = await this.userRepository.getUserByEmail(user.username);
    if (userByUsername) {
      throw ErrorType.ErrValidation("username is already exist");
    }

    // hash password
    user.password = this.hashPassword(user.password);

    // create user
    this.userRepository.createUser(user);
  }

  private hashPassword(password: string): string {
    const salt = genSaltSync(this.salt)
    return hashSync(password, salt);
  }

  private validate(user: user): void {
    if (user.email === "" && user.username === "") {
      throw ErrorType.ErrValidation("email or password should not be empty");
    }

    if (user.name === "") {
      throw ErrorType.ErrValidation("name should not be emtpy");
    }

    if (user.password === "") {
      throw ErrorType.ErrValidation("password should not be empty");
    }
  }
}
