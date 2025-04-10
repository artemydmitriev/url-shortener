import { IUserRepository } from '../../domain/repository/IUserRepository.js'
import { User } from '../../domain/entity/User.js'
import { PrismaClient } from '@prisma/client'

export class UserRepository implements IUserRepository {
  constructor(private db: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { email } })
    return user ? new User(user.id, user.email) : null
  }

  async create({ email }: { email: string }): Promise<User> {
    const user = await this.db.user.create({ data: { email } })
    return new User(user.id, user.email)
  }
}
