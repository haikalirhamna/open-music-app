import { nanoid } from 'nanoid';
import pool from '../../database/postgresPool.js';

export default class AlbumService {
  // Post album
  async addAlbum({ name, year }) {
    // create id
    const id = `album-${nanoid(16)}`;

    const result = await pool.query(
      'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      [id, name, year]
    );

    return result.rows[0]?.id;
  }

  async getAlbum({ id, title = null, performer = null }) {
  // Fetch the album details
    const albumResult = await pool.query(
      'SELECT * FROM albums WHERE id = $1',
      [id]
    );

    if (albumResult.rowCount === 0) {
      throw new Error('Album not found!');
    }

    const album = albumResult.rows[0];
    // Build dynamic song query
    let songQuery = 'SELECT id, title, performer FROM songs WHERE albumid = $1';
    const songParams = [id];
    let paramIndex = 2;

    if (title) {
      songQuery += ` AND title ILIKE $${paramIndex}`;
      songParams.push(`%${title}%`);
      paramIndex++;
    }

    if (performer) {
      songQuery += ` AND performer ILIKE $${paramIndex}`;
      songParams.push(`%${performer}%`);
    }

    const songsResult = await pool.query(songQuery, songParams);

    return {
      ...album,
      songs: songsResult.rows
    };
  }

  // put album
  async putAlbum({ id, name, year }) {
    const result = await pool.query(
      'UPDATE albums SET name = $2, year = $3 WHERE id = $1',
      [id, name, year]
    );

    if (result.rowCount === 0) {
      throw new Error('Album not found!');
    }

    return result.rows[0];
  }

  // delete album
  async deleteAlbum({ id }) {
    const result = await pool.query(
      'DELETE FROM albums WHERE id = $1 RETURNING id', [id]
    );

    if (result.rowCount === 0) {
      throw new Error('Album not found!');
    }

    return result.rows[0]?.id;
  }
}
