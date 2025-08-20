import ClientError from '../../exceptions/clientError.js';
import playlists from './index.js';
export default class PlaylistHandler {
  constructor(service, { PostPlaylistValidator, PostPlaylistSongValidator }) {
    this._service = service;
    this._PostPlaylistValidator = PostPlaylistValidator;
    this._PostPlaylistSongValidator = PostPlaylistSongValidator;

    this.postPlaylist = this.postPlaylist.bind(this);
    this.postSongToPlaylist = this.postSongToPlaylist.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.getPlaylistWithSongs = this.getPlaylistWithSongs.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.deleteSongFromPlaylist = this.deleteSongFromPlaylist.bind(this);
    this.getActivity = this.getActivity.bind(this);
  }

  async postPlaylist(request, h) {
    const { error } = this._PostPlaylistValidator.validate(request.payload);
    if (error) throw new ClientError(error.details[0].message);

    const { userId: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist({
      name: request.payload.name,
      owner: credentialId,
    });

    return h.response({
      status: 'success',
      data: { playlistId },
    }).code(201);
  }

  async postSongToPlaylist(request, h) {
    const { error } = this._PostPlaylistSongValidator.validate(request.payload);
    if (error) throw new ClientError(error.details[0].message);

    const { userId: credentialId } = request.auth.credentials;

    const playlistSongId = await this._service.addSongToPlaylist({
      id: request.params.id,
      owner: credentialId,
      songId: request.payload.songId,
    });

    return h.response({
      status: 'success',
      message: 'Song added to playlist',
      data: { playlistSongId }
    }).code(201);
  }

  async getPlaylists(request, h) {
    const { userId: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return h.response({
      status: 'success',
      data: { playlists },
    }).code(200);
  }

  async getPlaylistWithSongs(request, h) {
    const { userId: credentialId } = request.auth.credentials;
    const playlist = await this._service.getPlaylistWithSongs({
      id: request.params.id,
      userId: credentialId,
    });

    return h.response({
      status: 'success',
      data: { playlist },
    }).code(200);
  }

  async deletePlaylist(request, h) {
    const { userId: credentialId } = request.auth.credentials;

    await this._service.deletePlaylist({
      id: request.params.id,
      owner: credentialId,
    });

    return h.response({
      status: 'success',
      message: 'Playlist deleted',
    }).code(200);
  }

  async deleteSongFromPlaylist(request, h) {
    const { error } = this._PostPlaylistSongValidator.validate(request.payload);
    if (error) throw new ClientError(error.details[0].message);

    const { userId: credentialId } = request.auth.credentials;

    await this._service.removeSongFromPlaylist({
      id: request.params.id,
      owner: credentialId,
      songId: request.payload.songId,
    });

    return h.response({
      status: 'success',
      message: 'Song removed from playlist',
    }).code(200);
  }

  async getActivity(request, h) {
    const { userId: credentialId } = request.auth.credentials;
    const activities = await this._service.getActivity({
      id: request.params.id,
      owner: credentialId,
    });

    return h.response({
      status: 'success',
      data: {
        playlistId: request.params.id,
        activities: activities
      },
    }).code(200);
  }
}
