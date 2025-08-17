import ClientError from '../../exceptions/clientError.js';

export default class UserHandler {
  constructor(service, { PostUserValidator, PostAuthValidator, PutAuthTokenValidator, DeleteAuthTokenValidator }) {
    this._service = service;
    this._PostUserValidator = PostUserValidator;
    this._PostAuthValidator = PostAuthValidator;
    this._PutAuthTokenValidator = PutAuthTokenValidator;
    this._DeleteAuthTokenValidator = DeleteAuthTokenValidator;

    this.postUser = this.postUser.bind(this);
    this.postAuth = this.postAuth.bind(this);
    // this.putAuth = this.putAuth.bind(this);
    // this.deleteAuth = this.deleteAuth.bind(this);
  }

  async postUser(request, h) {
    try {
      const { error } = this._PostUserValidator.validate(request.payload);

      if (error) {
        throw new ClientError(error.details[0].message);
      }

      const user = await this._service.addUser(request.payload);
      return h.response({
        status: 'success',
        data: {
          userId: user
        }
      }).code(201);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }
  }

  async postAuth(request, h) {
    try {
      const { error } = this._PostAuthValidator.validate(request.payload);

      if (error) {
        throw new ClientError(error.details[0].message);
      }

      const user = await this._service.addUser(request.payload);
      return h.response({
        status: 'success',
        data: {
          userId: user
        }
      }).code(201);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }
  }
}