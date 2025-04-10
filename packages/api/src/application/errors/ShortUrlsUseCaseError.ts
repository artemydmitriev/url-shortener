import { ApplicationError } from './ApplicationError.js'

export class ShortUrlsUseCaseError extends ApplicationError {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
