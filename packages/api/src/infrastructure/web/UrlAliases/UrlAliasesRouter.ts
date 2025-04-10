import { FastifyPluginCallback } from 'fastify'
import { UrlAliasesHandler } from './UrlAliasesHandler.js'

export class UrlAliasesRouter {
  constructor(private readonly urlAliasesHandler: UrlAliasesHandler) {}

  register: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get('/:slug', this.urlAliasesHandler.handler)
    done()
  }
}
