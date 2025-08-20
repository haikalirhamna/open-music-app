import ClientError from '../../exceptions/clientError.js';
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
    const { error } = this._AlbumValidator.validate(request.payload);

    if (error) {
      throw new ClientError(error.details[0].message);
    }

    const albumId = await this._service.addAlbum(request.payload);

    return h.response({
      status: 'success',
      data: { albumId: albumId }
    }).code(201);
  }


  async getAlbumById(request, h) {
    const album = await this._service.getAlbum(request.params);

    return h.response({
      status: 'success',
      data: { album: album }
    }).code(200);
  }

  async putAlbumById(request, h) {
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

  }

  async deleteAlbumById(request, h) {
    const deleted = await this._service.deleteAlbum(request.params);

    return h.response({
      status: 'success',
      message: 'Album deleted',
    }).code(200);

  }
}
