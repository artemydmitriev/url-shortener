import { User } from '../entity/User.js'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: { email: string }): Promise<User>
}
