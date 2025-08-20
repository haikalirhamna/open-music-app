import { nanoid } from 'nanoid';
import Jwt from '@hapi/jwt';
import bcrypt from 'bcrypt';
import pool from '../../database/postgresPool.js';
import BadRequestError from '../../exceptions/badRequestError.js';
import UnauthorizedError from '../../exceptions/unauthorizedError.js';
export default class UserService {
  constructor() {
    this._accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    this._refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
    this._accessTokenAge = parseInt(process.env.ACCESS_TOKEN_AGE, 10) || 15 * 60; // fallback: 15 mins
  }

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

  async loginUser({ username, password }) {
    // check existing user
    const user = await pool.query('SELECT id, password FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Credential check
    const { id, password: hashedPassword } = user.rows[0];
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate access & refresh tokens
    const accessToken = Jwt.token.generate(
      { userId: id, },
      this._accessTokenKey,
      {
        ttlSec: this._accessTokenAge, // umur token (detik)
      }
    );

    const refreshToken = Jwt.token.generate(
      { userId: id, },
      this._refreshTokenKey,
      {
        ttlSec: 7 * 24 * 60 * 60, // 7 hari
      }
    );

    const result = await pool.query(
      'UPDATE users SET refresh_token = $2 WHERE id = $1 RETURNING id',
      [id, refreshToken]
    );

    if (!result) {
      throw new BadRequestError('Could not save refresh token');
    }

    return { accessToken, refreshToken };
  }

  async refreshAuth({ refreshToken }) {
    // verify refreshToken signature
    let decoded;
    try {
      decoded = Jwt.token.decode(refreshToken); // decode payload
      Jwt.token.verifySignature(decoded, this._refreshTokenKey); // verify signature
    } catch (err) {
      throw new BadRequestError();
    }

    const { userId } = decoded.decoded.payload;

    // check existing record
    const user = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND refresh_token = $2',
      [userId, refreshToken]
    );

    if (!user.rows.length) {
      throw new BadRequestError('Refresh token not valid or already removed');
    }

    // re-generate access token
    const accessToken = Jwt.token.generate(
      { userId: user.id },
      this._accessTokenKey,
      {
        ttlSec: this._accessTokenAge, // umur token (detik)
      }
    );

    return { accessToken };
  }

  async deleteAuth({ refreshToken }) {
    // verify refreshToken signature
    let decoded;
    try {
      decoded = Jwt.token.decode(refreshToken); // decode payload
      Jwt.token.verifySignature(decoded, this._refreshTokenKey); // verify signature
    } catch (err) {
      throw new BadRequestError();
    }

    const { userId } = decoded.decoded.payload;

    // check existing record
    const user = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND refresh_token = $2',
      [userId, refreshToken]
    );

    if (!user.rows.length) {
      throw new BadRequestError('Refresh token not valid or already removed');
    }

    // delete authentication (refreshToken)
    const result = await pool.query(
      'UPDATE users SET refresh_token = NULL WHERE id = $1 RETURNING id',
      [userId]
    );

    return result.rows[0];
  }
}