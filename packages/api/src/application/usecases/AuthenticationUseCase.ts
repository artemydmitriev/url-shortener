import { User } from '../../domain/entity/User.js'
import { IUserRepository } from '../../domain/repository/IUserRepository.js'

export class AuthenticationUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async authenticate(email: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      return existingUser
    }

    return this.userRepository.create({ email })
  }
}
