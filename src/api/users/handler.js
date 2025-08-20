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
    this.putAuth = this.putAuth.bind(this);
    this.deleteAuth = this.deleteAuth.bind(this);
  }

  async postUser(request, h) {
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
  }

  async postAuth(request, h) {
    const { error } = this._PostAuthValidator.validate(request.payload);

    if (error) {
      throw new ClientError(error.details[0].message);
    }

    const { accessToken, refreshToken } = await this._service.loginUser(request.payload);

    return h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    }).code(201);
  }

  async putAuth(request, h) {
    const { error } = this._PutAuthTokenValidator.validate(request.payload);

    if (error) {
      throw new ClientError(error.details[0].message);
    }

    const accessToken = await this._service.refreshAuth(request.payload);

    return h.response({
      status: 'success',
      data: accessToken
    }).code(200);
  }

  async deleteAuth(request, h) {
    const { error } = this._DeleteAuthTokenValidator.validate(request.payload);

    if (error) {
      throw new ClientError(error.details[0].message);
    }

    const result = await this._service.deleteAuth(request.payload);

    return h.response({
      status: 'success',
      message: 'User has been logged out successfully'
    }).code(200);
  }
}