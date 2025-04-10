import { ShortUrl } from '../../domain/entity/ShortUrl.js'
import { User } from '../../domain/entity/User.js'
import { IShortUrlRepository } from '../../domain/repository/IShortUrlRepository.js'
import crypto from 'node:crypto'

const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function toBase62(buffer: Buffer): string {
  const num = BigInt('0x' + buffer.toString('hex'))
  let result = ''
  let temp = num
  while (temp > 0) {
    result = base62Chars[Number(temp % 62n)] + result
    temp = temp / 62n
  }
  return result
}

function generateSlugFromUrl(url: string, length = 8): string {
  const hash = crypto.createHash('sha256').update(url).digest()
  const base62 = toBase62(hash)
  return base62.slice(0, length)
}

// export class SlugGenerator {
//   constructor(private readonly peekBySlug: (slug: string) => Promise<boolean>) {}

//   async generateUniqueSlug(): Promise<string> {
//     let slug: string
//     let attempts = 0
//     const maxAttempts = 5

//     do {
//       slug = Date.now().toString(36)
//       const exists = await this.peekBySlug(slug)
//       if (!exists) return slug

//       attempts++
//     } while (attempts < maxAttempts)

//     throw new Error('Failed to generate unique slug')
//   }
// }

export class ShortUrlsUseCase {
  constructor(private shortUrlsRepository: IShortUrlRepository) {}

  public async createShortUrl(user: User, url: string): Promise<ShortUrl> {
    const slug = await this.generateUniqueSlug(url)
    const shortUrl = new ShortUrl({ url, userId: user.id, slug })
    return this.shortUrlsRepository.create(shortUrl)
  }

  private async generateUniqueSlug(url: string): Promise<string> {
    let slug: string
    let attempts = 0
    const maxAttempts = 5

    do {
      slug = generateSlugFromUrl(url)
      const exists = await this.shortUrlsRepository.peekBySlug(slug)
      if (!exists) return slug

      attempts++
    } while (attempts < maxAttempts)

    throw new Error('Failed to generate unique slug')
  }

  public async getUrlBySlug(slug: string): Promise<ShortUrl | null> {
    return this.shortUrlsRepository.findBySlug(slug)
  }

  public async updateSlugInShortUrl(user: User, payload: ShortUrl): Promise<ShortUrl> {
    return this.shortUrlsRepository.update(payload)
  }

  public async updateSlugVisitsCounter(slugId: number): Promise<ShortUrl> {
    return this.shortUrlsRepository.updateVisitsCounter(slugId)
  }

  public async listShortUrlsByUser(user: User): Promise<ShortUrl[]> {
    return this.shortUrlsRepository.findAllByUserId(user.id)
  }

  public async listShortUrls(user: User): Promise<ShortUrl[]> {
    return this.listShortUrlsByUser(user)
  }
}
