import ClientError from './clientError.js';

export default class BadRequestError extends ClientError {
  constructor(message = 'Bad Request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}
