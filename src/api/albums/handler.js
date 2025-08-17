import ClientError from '../../exceptions/clientError.js';
import ServerError from '../../exceptions/serverError.js';
export default class AlbumHandler {
  constructor(service, { AlbumValidator }) {
    this._service = service;
    this._AlbumValidator = AlbumValidator;

    this.postAlbum = this.postAlbum.bind(this);
    this.getAlbumById = this.getAlbumById.bind(this);
    this.putAlbumById = this.putAlbumById.bind(this);
    this.deleteAlbumById = this.deleteAlbumById.bind(this);
  }

  async postAlbum(request, h) {
    try {
      const { error } = this._AlbumValidator.validate(request.payload);

      if (error) {
        throw new ClientError(error.details[0].message);
      }

      const albumId = await this._service.addAlbum(request.payload);
      return h.response({
        status: 'success',
        data: { albumId: albumId }
      }).code(201);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }
  }


  async getAlbumById(request, h) {
    try {
      const album = await this._service.getAlbum(request.params);
      return h.response({
        status: 'success',
        data: { album: album }
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }
  }

  async putAlbumById(request, h) {
    try {
      const { error } = this._AlbumValidator.validate(request.payload);

      if (error) {
        throw new ClientError(error.details[0].message);
      }

      const updated = await this._service.putAlbum({
        id: request.params.id,
        ...request.payload
      });
      return h.response({
        status: 'success',
        message: 'Album updated'
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }

  }

  async deleteAlbumById(request, h) {
    try {
      const deleted = await this._service.deleteAlbum(request.params);
      return h.response({
        status: 'success',
        message: 'Album deleted',
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }

  }
}
