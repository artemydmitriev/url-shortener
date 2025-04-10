import { FastifyPluginCallback } from 'fastify'
import { ShortUrlsHandler } from './ShortUrlsHandler.js'

export class ShortUrlsRoute {
  prefix = '/urls'

  constructor(private readonly shortUrlsHandler: ShortUrlsHandler) {}

  register: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get('/', this.shortUrlsHandler.listHandler)
    fastify.post('/', this.shortUrlsHandler.createHandler)
    done()
  }
}
