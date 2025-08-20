import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import dotenv from 'dotenv';
import openmusic from './src/plugins/index.js';
import ClientError from './src/exceptions/clientError.js';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: { origin: ['*'] }
    }
  });

  // Register JWT plugin
  await server.register(Jwt);

  // Define JWT auth strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: async (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: { userId: artifacts.decoded.payload.userId },
      };
    },
  });

  await server.register(openmusic);

  // Global Error Handler
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (!(response instanceof Error)) {
      return h.continue;
    }

    // Client Error
    if (response instanceof ClientError) {
      return h
        .response({
          status: 'fail',
          message: response.message,
        })
        .code(response.statusCode);
    }

    // Hapi/Boom error
    if (response.isBoom) {
      return h
        .response({
          status: 'fail',
          message: response.output.payload.message || 'Something went wrong',
        })
        .code(response.output.statusCode);
    }

    // Fallback (unexpected error)
    return h
      .response({
        status: 'fail',
        message: 'Internal Server Error',
      })
      .code(500);
  });

  await server.start();
  console.log(`🚀 Server running on ${server.info.uri}`);
};

init();