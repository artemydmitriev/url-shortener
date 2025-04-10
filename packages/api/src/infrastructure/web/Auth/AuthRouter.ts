import { FastifyPluginCallback } from 'fastify'
import { AuthHandler } from './AuthHandler.js'

export class AuthRouter {
  constructor(private readonly authHandler: AuthHandler) {}

  register: FastifyPluginCallback = (fastify, _, done) => {
    fastify.register(
      (fastify, _, done) => {
        fastify.post('/login', this.authHandler.login)
        fastify.get('/me', this.authHandler.me)
        done()
      },
      { prefix: '/auth' },
    )
    done()
  }
}
