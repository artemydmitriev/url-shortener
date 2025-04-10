import { RouteHandler } from 'fastify'
import { ShortUrlsUseCase } from '../../../application/usecases/ShortUrlsUseCase.js'
import { z } from 'zod'
import { UnauthorizedError, ValidationError } from '../../errors/HttpError.js'

const CreateShortUrlPayloadSchema = z.object({
  url: z.string().url(),
})

export class ShortUrlsHandler {
  constructor(private readonly shortUrlsUseCase: ShortUrlsUseCase) {}

  listHandler: RouteHandler = async (request) => {
    return this.shortUrlsUseCase.listShortUrls(request.user)
  }

  createHandler: RouteHandler = async (request) => {
    if (!request.user) {
      throw new UnauthorizedError()
    }

    const parsedPayload = CreateShortUrlPayloadSchema.safeParse(request.body)
    if (!parsedPayload.success) {
      throw new ValidationError('Invalig URL')
    }

    return this.shortUrlsUseCase.createShortUrl(request.user, parsedPayload.data.url)
  }

  updateHandler: RouteHandler = async () => {}
}
