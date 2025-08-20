import { nanoid } from 'nanoid';
import pool from '../../database/postgresPool.js';
import BadRequestError from '../../exceptions/badRequestError.js';
import ForbiddenError from '../../exceptions/forbiddenError.js';
import NotFoundError from '../../exceptions/notFoundError.js';

export default class CollaborationsService {
  async verifyPlaylistOwner(playlistId, userId) {
    const { rowCount } = await pool.query(
      'SELECT 1 FROM playlists WHERE id = $1 AND owner = $2',
      [playlistId, userId]
    );
    if (!rowCount) throw new ForbiddenError('You are not the owner of this playlist');
  }

  async addCollaborator({ owner, playlistId, userId }) {
    // check existing playlist
    const playlist = await pool.query(
      'SELECT id FROM playlists WHERE id = $1',
      [playlistId]
    );
    if (!playlist.rowCount) {
      throw new NotFoundError('Playlist not found');
    }

    // check existing user
    const user = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );
    if (!user.rowCount) {
      throw new NotFoundError('User not found');
    }
    // verify playlist owner
    await this.verifyPlaylistOwner(playlistId, owner);
    // Generate id
    const id = `collaborator-${nanoid(16)}`;
    const result = await pool.query(
      'INSERT INTO user_playlist_relation (id, "userId", "playlistId") VALUES ($1, $2, $3) RETURNING id',
      [id, userId, playlistId]
    );
    if (!result.rows.length) throw new BadRequestError('Failed to add collaborator');
    return result.rows[0].id;
  }

  async deleteCollaborator({ owner, playlistId, userId }) {
    // verify playlist owner
    await this.verifyPlaylistOwner(playlistId, owner);

    const result = await pool.query(
      'DELETE FROM user_playlist_relation WHERE "userId" = $1 AND "playlistId" = $2 RETURNING id',
      [userId, playlistId]
    );

    if (!result.rowCount) throw new NotFoundError('Collaborator not found in this playlist');
    return result.rows[0].id;
  }
}