import { AuthenticationUseCase } from '../../../application/usecases/AuthenticationUseCase.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError } from '../../errors/HttpError.js'

export class AuthHandler {
  constructor(private readonly authenticationUseCase: AuthenticationUseCase) {}

  public me = async (req: FastifyRequest) => {
    const user = req.session.get('user')
    if (!user) {
      throw new UnauthorizedError('User not authenticated')
    }

    return { user }
  }

  public login = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email } = req.body as { email: string }

    if (!email || typeof email !== 'string') {
      return reply.status(400).send({
        ok: false,
        message: 'Email is required',
      })
    }

    const user = await this.authenticationUseCase.authenticate(email)

    req.session.set('user', { id: user.id, email: user.email })
    return reply.send({ ok: true, user })
  }
}
