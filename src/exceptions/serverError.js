export default class ServerError extends Error {
  constructor(message = 'Internal Server Error') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 500;
    this.isServerError = true;
  }
}