import { RouteHandler } from 'fastify'
import { ShortUrlsUseCase } from '../../../application/usecases/ShortUrlsUseCase.js'
import { NotFoundError } from '../../errors/HttpError.js'

export class UrlAliasesHandler {
  constructor(private readonly shortUrlsUseCase: ShortUrlsUseCase) {}

  handler: RouteHandler = async (request, reply) => {
    const { slug } = request.params as { slug: string }

    const url = await this.shortUrlsUseCase.getUrlBySlug(slug)
    if (!url) {
      throw new NotFoundError(`Slug not found`)
    }

    await this.shortUrlsUseCase.updateSlugVisitsCounter(url.id!)
    return reply.redirect(url?.url)
  }
}
