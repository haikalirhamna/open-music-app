import ClientError from '../../exceptions/clientError.js';
export default class SongHandler {
  constructor(service, { SongValidator }) {
    this._service = service;
    this._SongValidator = SongValidator;

    this.postSong = this.postSong.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.getSongById = this.getSongById.bind(this);
    this.putSongById = this.putSongById.bind(this);
    this.deleteSongById = this.deleteSongById.bind(this);
  }

  async postSong(request, h) {
    try {
      const { error } = this._SongValidator.validate(request.payload);

      if (error) {
        throw new ClientError(error.details[0].message);
      }

      const song = await this._service.addSong(request.payload);
      return h.response({
        status: 'success',
        data: {
          songId: song
        }
      }).code(201);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }
  }

  async getSongs(request, h) {
    try {
      const songs = await this._service.getSongs(request.query);
      return h.response({
        status: 'success',
        data: {
          songs: songs
        }
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }
  }

  async getSongById(request, h) {
    try {

      const song = await this._service.getSong(request.params);
      return h.response({
        status: 'success',
        data: {
          song: song
        }
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }
  }

  async putSongById(request, h) {
    try {
      const { error } = this._SongValidator.validate(request.payload);

      if (error) {
        throw new ClientError(error.details[0].message);
      }

      const updated = await this._service.putSong({
        id: request.params.id,
        ...request.payload
      });
      return h.response({
        status: 'success',
        message: 'Song updated'
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }

  }

  async deleteSongById(request, h) {
    try {
      const deleted = await this._service.deleteSong(request.params);
      return h.response({
        status: 'success',
        message: 'Song deleted',
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(err.statusCode);
    }
  }

}
