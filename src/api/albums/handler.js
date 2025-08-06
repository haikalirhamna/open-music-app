export default class AlbumHandler {
  constructor(service, { AlbumValidator, IdValidator }) {
    this._service = service;
    this._AlbumValidator = AlbumValidator;
    this._IdValidator = IdValidator;

    this.postAlbum = this.postAlbum.bind(this);
    this.getAlbumById = this.getAlbumById.bind(this);
    this.putAlbumById = this.putAlbumById.bind(this);
    this.deleteAlbumById = this.deleteAlbumById.bind(this);
  }

  async postAlbum(request, h) {
    try {
      const { error } = this._AlbumValidator.validate(request.payload);
      if (error) {
        return h.response({
          status: 'fail',
          message: error.details[0].message,
        }).code(400);
      }

      const albumId = await this._service.addAlbum(request.payload);
      return h.response({
        status: 'success',
        data: { albumId: albumId }
      }).code(201);
    } catch (err) {
      return h.response({
        status: 'error',
        message: 'Internal Server Error'
      }).code(500);
    }
  }


  async getAlbumById(request, h) {
    try {
      const { error } = this._IdValidator.validate(request.params);
      if (error) {
        return h.response({
          status: 'fail',
          message: error.details[0].message,
        }).code(404);
      }

      const album = await this._service.getAlbum(request.params);
      return h.response({
        status: 'success',
        data: { album: album }
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(404);
    }
  }

  async putAlbumById(request, h) {
    try {
      // Validate payload (name, year)
      const { error: payloadError } = this._AlbumValidator.validate(request.payload);

      if (payloadError) {
        return h.response({
          status: 'fail',
          message: payloadError.details[0].message,
        }).code(400);
      }

      // Validate ID from params
      const { error: idError } = this._IdValidator.validate(request.params);

      if (idError) {
        return h.response({
          status: 'fail',
          message: idError.details[0].message,
        }).code(404);
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
      }).code(404);
    }

  }

  async deleteAlbumById(request, h) {
    try {
      const { error } = this._IdValidator.validate(request.params);

      if (error) {
        return h.response({
          status: 'fail',
          message: error.details[0].message,
        }).code(404);
      }

      const deleted = await this._service.deleteAlbum(request.params);
      return h.response({
        status: 'success',
        message: 'Album deleted',
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message,
      }).code(404);
    }

  }
}
