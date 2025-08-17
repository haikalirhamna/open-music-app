import Joi from 'joi';

// POST /users
export const PostUserValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required()
});

// POST /authentications (login)
export const PostAuthValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// PUT /authentications (refresh token)
export const PutAuthTokenValidator = Joi.object({
  refreshToken: Joi.string().required()
});

// DELETE /authentications (logout)
export const DeleteAuthTokenValidator = Joi.object({
  refreshToken: Joi.string().required()
});

// POST /albums
export const AlbumValidator = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required()
});

// POST /songs
export const SongValidator = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

// POST /playlists
export const PostPlaylistValidator = Joi.object({
  name: Joi.string().required()
});

// POST /playlists/{id}/songs
export const PostPlaylistSongValidator = Joi.object({
  songId: Joi.string().required()
});