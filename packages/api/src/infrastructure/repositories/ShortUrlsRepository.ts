import { PrismaClient } from '@prisma/client'
import { IShortUrlRepository } from '../../domain/repository/IShortUrlRepository.js'
import { ShortUrl } from '../../domain/entity/ShortUrl.js'

export class ShortUrlsRepository implements IShortUrlRepository {
  constructor(private db: PrismaClient) {}

  async create(payload: ShortUrl) {
    return this.db.shortUrl.create({
      data: {
        slug: payload.slug,
        url: payload.url,
        userId: payload.userId,
      },
    })
  }

  async update(payload: ShortUrl) {
    return this.db.shortUrl.update({
      where: { id: payload.id },
      data: {
        slug: payload.slug,
        url: payload.url,
        userId: payload.userId,
      },
    })
  }

  async deleteById(id: number) {
    return this.db.shortUrl.delete({ where: { id } })
  }

  async findById(id: number) {
    return this.db.shortUrl.findUnique({ where: { id } })
  }

  async findAll() {
    return this.db.shortUrl.findMany()
  }

  async findBySlug(slug: string) {
    return this.db.shortUrl.findFirst({
      where: { slug },
    })
  }

  async peekBySlug(slug: string) {
    const [result]: Array<{ exists: boolean }> = await this.db
      .$queryRaw`SELECT EXISTS (SELECT 1 FROM "ShortUrl" WHERE slug = ${slug}) as "exists"`
    return !!result?.exists
  }

  async findAllByUserId(userId: number): Promise<ShortUrl[]> {
    return this.db.shortUrl.findMany({
      where: { userId },
    })
  }
}
