import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import openmusic from './src/plugins/index.js';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: { origin: ['*'] }
    }
  });

  await server.register(openmusic);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();