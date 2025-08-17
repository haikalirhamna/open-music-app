import { nanoid } from 'nanoid';
import pool from '../../database/postgresPool.js';
import BadRequestError from '../../exceptions/badRequestError.js';
import NotFoundError from '../../exceptions/notFoundError.js';

export default class UserService {
  async addUser({ username, password, fullname }) {
    // check existing records
    const check = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

    if (check.rows.length > 0) {
      throw new BadRequestError('This username is already taken');
    }
    // create id
    const id = `user-${nanoid(16)}`;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      [id, username, hashedPassword, fullname]
    );

    if (!result.rows.length) {
      throw new BadRequestError('User could not be created');
    }

    return result.rows[0]?.id;
  }

  async postAuth({ username, password}) {
    // check existing records
    const check = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

    if (check.rows.length > 0) {
      throw new NotFoundError('This username is not found');
    }
  }
}