import { RouteHandler } from 'fastify'
import { ShortUrlsUseCase } from '../../../application/usecases/ShortUrlsUseCase.js'
import { NotFoundError } from '../../errors/HttpError.js'
import { z } from 'zod'

const SlugSchema = z.object({
  slug: z.string().nonempty().max(6),
})

export class UrlAliasesHandler {
  constructor(private readonly shortUrlsUseCase: ShortUrlsUseCase) {}

  handler: RouteHandler = async (request, reply) => {
    const { slug } = SlugSchema.parse(request.params)

    const url = await this.shortUrlsUseCase.getUrlBySlug(slug)
    if (!url) {
      throw new NotFoundError()
    }

    await this.shortUrlsUseCase.updateSlugVisitsCounter(url.id!)
    return reply.redirect(url?.url)
  }
}
