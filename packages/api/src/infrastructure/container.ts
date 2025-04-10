import { createContainer, asClass, asValue, InjectionMode } from 'awilix'
import { FastifyServer } from './server.js'
import { config, Config } from './config.js'
import { prisma } from './persistence/prisma.js'
import { PrismaClient } from '@prisma/client'
import { ShortUrlsHandler } from './web/ShortUrls/ShortUrlsHandler.js'
import { ShortUrlsUseCase } from '../application/usecases/ShortUrlsUseCase.js'
import { ShortUrlsRepository } from './repositories/ShortUrlsRepository.js'
import { ShortUrlsRoute } from './web/ShortUrls/ShortUrlsRouter.js'
import { UrlAliasesRouter } from './web/UrlAliases/UrlAliasesRouter.js'
import { UrlAliasesHandler } from './web/UrlAliases/UrlAliasesHandler.js'
import { AuthRouter } from './web/Auth/AuthRouter.js'
import { AuthHandler } from './web/Auth/AuthHandler.js'
import { AuthenticationUseCase } from '../application/usecases/AuthenticationUseCase.js'
import { UserRepository } from './repositories/UserRepository.js'

export type Dependencies = {
  // Infrastructure
  config: Config
  server: FastifyServer
  db: PrismaClient
  // Repositories
  shortUrlsRepository: ShortUrlsRepository
  userRepository: UserRepository
  // Use cases
  shortUrlsUseCase: ShortUrlsUseCase
  authenticationUseCase: AuthenticationUseCase
  // Handlers
  authHandler: AuthHandler
  authRouter: AuthRouter
  shortUrlsHandler: ShortUrlsHandler
  shortUrlsRouter: ShortUrlsRoute
  urlAliasesHandler: UrlAliasesHandler
  urlAliasesRouter: UrlAliasesRouter
}

const container = createContainer<Dependencies>({
  injectionMode: InjectionMode.CLASSIC,
  strict: true,
})

container.register({
  // Infrastructure
  config: asValue(config),
  server: asClass(FastifyServer).singleton(),
  db: asValue(prisma),

  // Repositories
  shortUrlsRepository: asClass(ShortUrlsRepository).singleton(),
  userRepository: asClass(UserRepository).singleton(),

  // Use cases
  authenticationUseCase: asClass(AuthenticationUseCase).singleton(),
  shortUrlsUseCase: asClass(ShortUrlsUseCase).singleton(),

  // Handlers
  authHandler: asClass(AuthHandler).singleton(),
  authRouter: asClass(AuthRouter).singleton(),
  shortUrlsHandler: asClass(ShortUrlsHandler).singleton(),
  shortUrlsRouter: asClass(ShortUrlsRoute).singleton(),
  urlAliasesHandler: asClass(UrlAliasesHandler).singleton(),
  urlAliasesRouter: asClass(UrlAliasesRouter).singleton(),
})

if (config.NODE_ENV === 'development') {
  container.register({})
}

export default container
