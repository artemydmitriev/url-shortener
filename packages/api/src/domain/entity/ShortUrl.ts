export class ShortUrl {
  id?: number
  userId: number
  url: string
  slug: string

  constructor({
    id,
    userId,
    url,
    slug,
  }: {
    id?: number
    userId: number
    url: string
    slug: string
  }) {
    this.id = id
    this.userId = userId
    this.url = url
    this.slug = slug
  }
}
