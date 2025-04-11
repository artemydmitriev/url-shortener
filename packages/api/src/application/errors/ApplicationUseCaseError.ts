import { ApplicationError } from './ApplicationError.js'

export class ApplicationUseCaseError extends ApplicationError {
  constructor(message: string) {
    super(message)
  }
}
