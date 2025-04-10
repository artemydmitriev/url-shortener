export class ShortUrl {
  id?: number
  userId: number
  url: string
  slug: string
  visits?: number

  constructor({
    id,
    userId,
    url,
    slug,
    visits,
  }: {
    id?: number
    userId: number
    url: string
    slug: string
    visits?: number
  }) {
    this.id = id
    this.userId = userId
    this.url = url
    this.slug = slug
    this.visits = visits
  }
}
