import Fastify, { FastifyInstance } from 'fastify'
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { Config } from './config.js'
import { ShortUrlsRoute } from './web/ShortUrls/ShortUrlsRouter.js'
import { UrlAliasesRouter } from './web/UrlAliases/UrlAliasesRouter.js'
import {
  HttpError,
  InternalServerError,
  TooManyRequestsError,
  ValidationError,
} from './errors/HttpError.js'
import { ApplicationError } from '../application/errors/ApplicationError.js'
import { z } from 'zod'
import { User } from '../domain/entity/User.js'
import { AuthRouter } from './web/Auth/AuthRouter.js'
import { RateLimiterMemory } from 'rate-limiter-flexible'

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null
  }
}

declare module 'fastify' {
  interface Session {
    user?: {
      id: number
      email: string
    }
  }
}

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 10,
})

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

export class FastifyServer {
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>

  constructor(
    private readonly config: Config,
    private readonly authRouter: AuthRouter,
    private readonly shortUrlsRouter: ShortUrlsRoute,
    private readonly urlAliasesRouter: UrlAliasesRouter,
  ) {
    this.fastify = Fastify({ logger: envToLogger[config.NODE_ENV] })
  }

  async init() {
    this.fastify.register(fastifyCookie)
    this.fastify.register(fastifySession, {
      secret: this.config.SESSION_SECRET,
      cookieName: 'sid',
      cookie: { sameSite: 'lax', maxAge: 1800000, secure: false },
    })

    this.fastify.register(cors, {
      origin: this.config.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    })

    this.fastify.setErrorHandler(function (error, request, reply) {
      if (error instanceof HttpError) {
        this.log.warn(error)
        reply.send(error)
      } else if (error instanceof z.ZodError) {
        this.log.warn(error)
        reply.send(new ValidationError())
      } else if (error instanceof ApplicationError) {
        this.log.error(error)
        reply.send(new InternalServerError())
      } else {
        this.log.error(error)
        reply.send(error)
      }
    })

    this.fastify.addHook('onRequest', async (req, reply) => {
      try {
        await rateLimiter.consume(req.ip)
      } catch {
        reply.send(new TooManyRequestsError())
      }
    })

    this.fastify.decorateRequest('user', null)
    this.fastify.addHook('preHandler', (request, reply, done) => {
      const sessionUser = request.session.get('user')
      if (sessionUser) {
        request.user = new User(sessionUser.id, sessionUser.email)
      }
      done()
    })

    this.fastify.register(this.authRouter.register)
    this.fastify.register(this.shortUrlsRouter.register, {
      prefix: this.shortUrlsRouter.prefix,
    })
    this.fastify.register(this.urlAliasesRouter.register)

    this.fastify.get('/health', async () => ({ status: 'ok' }))
  }

  async start() {
    await this.init()
    return await this.fastify.listen({ host: this.config.HOST, port: this.config.PORT })
  }
}
