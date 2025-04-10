import { ShortUrl } from '../../domain/entity/ShortUrl.js'
import { User } from '../../domain/entity/User.js'
import { IShortUrlRepository } from '../../domain/repository/IShortUrlRepository.js'
import { customAlphabet } from 'nanoid'
import { ShortUrlsUseCaseError } from '../errors/ShortUrlsUseCaseError.js'

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  6,
)

export class ShortUrlsUseCase {
  constructor(private shortUrlsRepository: IShortUrlRepository) {}

  async createShortUrl(user: User, url: string): Promise<ShortUrl> {
    const slug = await this.generateUniqueSlug()
    return this.shortUrlsRepository.create(new ShortUrl({ url, userId: user.id, slug }))
  }

  private async generateUniqueSlug(): Promise<string> {
    const maxAttempts = 5

    for (let i = 0; i < maxAttempts; i++) {
      const slug = nanoid()
      const exists = await this.shortUrlsRepository.peekBySlug(slug)

      if (!exists) {
        return slug
      }
    }

    throw new ShortUrlsUseCaseError('Failed to generate unique slug')
  }

  async getUrlBySlug(slug: string): Promise<ShortUrl | null> {
    return this.shortUrlsRepository.findBySlug(slug)
  }

  async updateSlugInShortUrl(user: User, payload: ShortUrl): Promise<ShortUrl> {
    return this.shortUrlsRepository.update(payload)
  }

  async updateSlugVisitsCounter(slugId: number): Promise<ShortUrl> {
    return this.shortUrlsRepository.updateVisitsCounter(slugId)
  }

  async listShortUrlsByUser(user: User): Promise<ShortUrl[]> {
    return this.shortUrlsRepository.findAllByUserId(user.id)
  }

  async listShortUrls(user: User): Promise<ShortUrl[]> {
    return this.listShortUrlsByUser(user)
  }
}
