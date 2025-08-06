import { nanoid } from 'nanoid';
import pool from '../../database/postgresPool.js';

export default class SongService {
  // Post song
  async addSong({ title, year, genre, performer, duration, albumId }) {
    // create id
    const id = `song-${nanoid(16)}`;

    const result = await pool.query(
      'INSERT INTO songs (id, title, year, genre, performer, duration, albumid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [id, title, year, genre, performer, duration, albumId]
    );

    return result.rows[0]?.id;
  }

  // get all songs
  async getSongs({ title, performer }) {
    let query = 'SELECT id, title, performer FROM songs';
    const conditions = [];
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    if (performer) {
      values.push(`%${performer}%`);
      conditions.push(`performer ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${  conditions.join(' AND ')}`;
    }
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw new Error('Song not found!');
    }

    return result.rows;
  }

  // get song by id
  async getSong({ id }) {
    const result = await pool.query(
      'SELECT * FROM songs WHERE id = $1', [id]
    );

    if (result.rowCount === 0) {
      throw new Error('Song not found!');
    }

    return result.rows[0];
  }

  // put song
  async putSong({ id, title, year, genre, performer, duration, albumId }) {
    const result = await pool.query(
      'UPDATE songs SET title = $2, year = $3, genre = $4, performer = $5, duration = $6, albumId = $7 WHERE id = $1 RETURNING id',
      [id, title, year, genre, performer, duration, albumId]
    );

    if (result.rowCount === 0) {
      throw new Error('Song not found!');
    }

    return result.rows[0];
  }

  // delete song
  async deleteSong({ id }) {
    const result = await pool.query(
      'DELETE FROM songs WHERE id = $1 RETURNING id', [id]
    );

    if (result.rowCount === 0) {
      throw new Error('Song not found!');
    }

    return result.rows[0];
  }
}
