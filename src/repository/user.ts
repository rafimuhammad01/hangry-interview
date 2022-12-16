import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { User } from "../entity/user";

export interface UserRepository {
  getUserByUsername(username: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: User): void;
}

export class UserRepositoryImpl implements UserRepository {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const data = await this.db.user.findFirst({
      where: {
        username: username,
      },
    });

    if (data) {
      return {
        id: data?.id,
        name: data?.name ?? "",
        username: data?.username ?? "",
        email: data?.email ?? "",
        password: data?.password ?? "",
      };
    }

    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const data = await this.db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (data) {
      return {
        id: data?.id,
        name: data?.name ?? "",
        username: data?.username ?? "",
        email: data?.email ?? "",
        password: data?.password ?? "",
      };
    }

    return null;
  }

  async createUser(user: User): Promise<void> {
    await this.db.user.create({
      data: user,
    } as Prisma.userCreateArgs);
  }
}
