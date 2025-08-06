import Joi from 'joi';

export const IdValidator = Joi.object({
  id: Joi.string().required()
});

export const AlbumValidator = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required()
});

export const SongValidator = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});