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
  }

  async getSongs(request, h) {
    const songs = await this._service.getSongs(request.query);

    return h.response({
      status: 'success',
      data: {
        songs: songs
      }
    }).code(200);
  }

  async getSongById(request, h) {
    const song = await this._service.getSong(request.params);

    return h.response({
      status: 'success',
      data: {
        song: song
      }
    }).code(200);
  }

  async putSongById(request, h) {
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
  }

  async deleteSongById(request, h) {
    const deleted = await this._service.deleteSong(request.params);

    return h.response({
      status: 'success',
      message: 'Song deleted',
    }).code(200);
  }
}
