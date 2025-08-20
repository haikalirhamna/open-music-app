import { nanoid } from 'nanoid';
import pool from '../../database/postgresPool.js';
import BadRequestError from '../../exceptions/badRequestError.js';
import NotFoundError from '../../exceptions/notFoundError.js';
import UnauthorizedError from '../../exceptions/unauthorizedError.js';
import ForbiddenError from '../../exceptions/forbiddenError.js';
import playlists from './index.js';

export default class PlaylistService {
  async verifyPlaylistOwner(playlistId, userId) {
    const { rowCount } = await pool.query(
      'SELECT 1 FROM playlists WHERE id = $1 AND owner = $2',
      [playlistId, userId]
    );
    if (!rowCount) throw new ForbiddenError('You are not the owner of this playlist');
  }

  async verifyPlaylistAccess(playlistId, userId) {
    // verify owner
    const owner = await pool.query(
      'SELECT 1 FROM playlists WHERE id = $1 AND owner = $2',
      [playlistId, userId]
    );

    if (owner.rowCount) return;

    const collaborator = await pool.query(
      'SELECT 1 FROM user_playlist_relation WHERE "playlistId" = $1 AND "userId" = $2',
      [playlistId, userId]
    );

    if (collaborator.rowCount) return;

    throw new ForbiddenError('You are not the owner of this playlist');
  }

  async addActivity({ playlistId, username, title, action }) {
    const id = `log-${nanoid(16)}`;
    const result = await pool.query(
      `INSERT INTO logs_activity (id, "playlistId", username, title, action, time)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id`,
      [id, playlistId, username, title, action]
    );

    if (!result.rowCount) {
      throw new BadRequestError('Failed to record activity log');
    }

    return result.rows[0].id;
  }


  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const result = await pool.query(
      'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      [id, name, owner]
    );
    if (!result.rows.length) throw new BadRequestError('Failed to create playlist');

    return result.rows[0].id;
  }

  async addSongToPlaylist({ id, owner, songId }) {
    // verify playlist owner
    await this.verifyPlaylistAccess(id, owner);
    // check existing song
    const song = await pool.query(
      'SELECT * FROM songs WHERE id = $1',
      [songId]
    );

    if (!song.rowCount) {
      throw new NotFoundError('Song Not Found');
    }

    const playlistSongsId = `playlist-song-${nanoid(16)}`;

    const result = await pool.query(
      'INSERT INTO playlist_songs (id, "playlistId", "songId") VALUES ($1, $2, $3) RETURNING id',
      [playlistSongsId, id, songId]
    );

    if (!result.rows.length) {
      throw new BadRequestError('Failed to add song to playlist');
    }

    // get user
    const user = await pool.query(
      'SELECT username FROM users WHERE id = $1', [owner]
    );
    if (!user.rowCount) throw new NotFoundError('User Not Found');
    // Add Activity
    await this.addActivity({
      playlistId: id,
      username: user.rows[0].username,
      title: song.rows[0].title,
      action: 'add'
    });

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const result = await pool.query(
      `SELECT DISTINCT p.id, p.name, u.username
      FROM playlists p
      JOIN users u ON u.id = p.owner
      LEFT JOIN user_playlist_relation upr ON upr."playlistId" = p.id
      WHERE p.owner = $1 OR upr."userId" = $1
      ORDER BY p.name ASC`,
      [userId]
    );
    return result.rows;
  }

  async getPlaylistWithSongs({ id, userId }) {
    const playlistResult = await pool.query(
      `SELECT p.id, p.name, u.username
      FROM playlists p
      JOIN users u ON u.id = p.owner
      WHERE p.id = $1`,
      [id]
    );
    if (!playlistResult.rowCount) throw new NotFoundError('Playlist not found');

    const songsResult = await pool.query(
      `SELECT s.id, s.title, s.performer
      FROM playlist_songs ps
      JOIN songs s ON s.id = ps."songId"
      WHERE ps."playlistId" = $1
      ORDER BY s.title ASC`,
      [id]
    );

    // verify playlist owner
    await this.verifyPlaylistAccess(id, userId);

    return {
      id: playlistResult.rows[0].id,
      name: playlistResult.rows[0].name,
      username: playlistResult.rows[0].username,
      songs: songsResult.rows,
    };
  }

  async deletePlaylist({ id, owner }) {
    // verify playlist owner
    await this.verifyPlaylistOwner(id, owner);

    // Delete playlist
    const result = await pool.query(
      'DELETE FROM playlists WHERE id = $1 AND owner = $2',
      [id, owner]
    );
    if (!result.rowCount) throw new NotFoundError('Playlist not found or already deleted');
  }

  async removeSongFromPlaylist({ id, owner, songId }) {
    // verify playlist owner
    await this.verifyPlaylistAccess(id, owner);

    // check existing song
    const song = await pool.query(
      'SELECT * FROM songs WHERE id = $1',
      [songId]
    );

    const result = await pool.query(
      'DELETE FROM playlist_songs WHERE "playlistId" = $1 AND "songId" = $2',
      [id, songId]
    );
    if (!result.rowCount) throw new NotFoundError('Song not found in this playlist');

    // get user
    const user = await pool.query(
      'SELECT username FROM users WHERE id = $1', [owner]
    );
    if (!user.rowCount) throw new NotFoundError('User Not Found');
    // Add Activity
    await this.addActivity({
      playlistId: id,
      username: user.rows[0].username,
      title: song.rows[0].title,
      action: 'delete'
    });
  }

  async getActivity({ id, owner }) {
    // check existing playlists
    const playlist = await pool.query(
      'SELECT id FROM playlists WHERE id = $1',
      [id]
    );

    if (!playlist.rowCount) {
      throw new NotFoundError('Playlist not found');
    }
    // verify playlist owner
    await this.verifyPlaylistAccess(id, owner);
    // get all activity
    const result = await pool.query(
      `SELECT username, title, action, time
      FROM logs_activity
      WHERE "playlistId" = $1
      ORDER BY time ASC`,
      [id]
    );

    return result.rows;
  }
}