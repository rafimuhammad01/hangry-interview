import { user } from "@prisma/client";
import { PrismaClient } from "@prisma/client";


export interface UserRepository {
  getUserByUsername(username: string): Promise<user | null> ;
  getUserByEmail(email: string): Promise<user | null>;
  createUser(user: user): void;
}

export class UserRepositoryImpl implements UserRepository {
  db: PrismaClient

  constructor(db: PrismaClient) {
    this.db = db
  }

  async getUserByUsername(username: string): Promise<user | null> {
    const data = await this.db.user.findUnique({
      where: {
        username : username
      }
    })

    return data
  }

  async getUserByEmail(email: string): Promise<user | null> {
    const data = await this.db.user.findUnique({
      where: {
        email: email
      }
    })

    return data
  }

  async createUser(user: user): Promise<void> {
    await this.db.user.create({
      data : user
    })
  }
}
