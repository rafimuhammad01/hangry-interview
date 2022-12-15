import { User } from "@prisma/client";

export interface UserRepository {
  getUserByUsername(username: string): User;
  getUserByEmail(email: string): User | undefined;
  createUser(user: User): void;
}

export class UserRepositoryImpl implements UserRepository {
  getUserByUsername(username: string): User {
    throw new Error("Method not implemented.");
  }
  getUserByEmail(email: string): User | undefined {
    throw new Error("Method not implemented.");
  }
  createUser(user: User): void {
    throw new Error("Method not implemented.");
  }
}
