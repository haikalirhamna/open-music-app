import ClientError from './clientError.js';

export default class UnauthorizedError extends ClientError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}
