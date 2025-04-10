import { AuthenticationUseCase } from '../../../application/usecases/AuthenticationUseCase.js'
import { RouteHandler } from 'fastify'
import { UnauthorizedError } from '../../errors/HttpError.js'
import { z } from 'zod'

const LoginPayloadSchema = z.object({
  email: z.string().nonempty().email(),
})

export class AuthHandler {
  constructor(private readonly authenticationUseCase: AuthenticationUseCase) {}

  public me: RouteHandler = async (request) => {
    if (!request.user) {
      throw new UnauthorizedError()
    }

    return { user: request.user }
  }

  public login: RouteHandler = async (request) => {
    const { email } = LoginPayloadSchema.parse(request.body)

    const user = await this.authenticationUseCase.authenticate(email)

    request.session.set('user', { id: user.id, email: user.email })
    return { user }
  }
}
