export default class SongHandler {
  constructor(service, { SongValidator, IdValidator }) {
    this._service = service;
    this._SongValidator = SongValidator;
    this._IdValidator = IdValidator;

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
        return h.response({
          status: 'fail',
          message: error.details[0].message,
        }).code(400);
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
        message: 'Song not added'
      }).code(404);
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
      }).code(404);
    }
  }

  async getSongById(request, h) {
    try {
      const { error } = this._IdValidator.validate(request.params);

      if (error) {
        return h.response({
          status: 'fail',
          message: error.details[0].message,
        }).code(404);
      }

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
      }).code(404);
    }
  }

  async putSongById(request, h) {
    try {
      // Validate ID from params
      const { error: idError } = this._IdValidator.validate(request.params);

      if (idError) {
        return h.response({
          status: 'fail',
          message: idError.details[0].message,
        }).code(404);
      }

      // Validate payload (name, year)
      const { error: payloadError } = this._SongValidator.validate(request.payload);

      if (payloadError) {
        return h.response({
          status: 'fail',
          message: payloadError.details[0].message,
        }).code(400);
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
      }).code(404);
    }

  }

  async deleteSongById(request, h) {
    try {
      const { error } = this._IdValidator.validate(request.params);

      if (error) {
        return h.response({
          status: 'fail',
          message: error.details[0].message,
        }).code(404);
      }

      const deleted = await this._service.deleteSong(request.params);
      return h.response({
        status: 'success',
        message: 'Song deleted',
      }).code(200);
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message
      }).code(404);
    }
  }

}
