import { FastifyPluginAsync } from 'fastify'
import { AuthHandler } from './AuthHandler.js'

export class AuthRouter {
  constructor(private readonly authHandler: AuthHandler) {}

  register: FastifyPluginAsync = async (fastify) => {
    fastify.register(
      async (fastify) => {
        fastify.post('/login', this.authHandler.login)
        fastify.get('/me', this.authHandler.me)
      },
      { prefix: '/auth' },
    )
  }
}
