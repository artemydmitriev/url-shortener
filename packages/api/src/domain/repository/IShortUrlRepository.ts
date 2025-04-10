import { ShortUrl } from '../entity/ShortUrl.js'

export interface IShortUrlRepository {
  create(payload: ShortUrl): Promise<ShortUrl>
  update(payload: ShortUrl): Promise<ShortUrl>
  updateVisitsCounter(id: number): Promise<ShortUrl>
  deleteById(id: number): Promise<ShortUrl>
  findAll(): Promise<ShortUrl[]>
  findById(id: number): Promise<ShortUrl | null>
  findBySlug(slug: string): Promise<ShortUrl | null>
  peekBySlug(slug: string): Promise<boolean>
  findAllByUserId(userId: number): Promise<ShortUrl[]>
}
