import { User } from "@prisma/client";
import { UserRepository } from "../repository/userRepository";
import { ErrorType } from "../utils/errors";

class UserService {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  register(user: User) {
    // validate user instance
    this.validate(user);

    // check if username or email is exist
    const userByEmail = this.userRepository.getUserByEmail(user.email);
    if (userByEmail) {
      throw ErrorType.ErrValidation("email already exist");
    }
    const userByUsername = this.userRepository.getUserByEmail(user.username);
    if (userByUsername) {
      throw ErrorType.ErrValidation("username is already exist");
    }

    // hash password
    user.password = this.hashPassword(user.password);

    // create user
    this.userRepository.createUser(user);
  }

  private hashPassword(password: string): string {
    return "";
  }

  private validate(user: User): void {
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
