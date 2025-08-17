import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
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

// import Hapi from '@hapi/hapi';
// import Jwt from '@hapi/jwt';
// import dotenv from 'dotenv';
// import openmusic from './src/plugins/index.js';

// dotenv.config();

// const init = async () => {
//   const server = Hapi.server({
//     port: process.env.PORT,
//     host: process.env.HOST,
//     routes: {
//       cors: { origin: ['*'] }
//     }
//   });

//   // Register JWT plugin
//   await server.register(Jwt);

//   // Define JWT auth strategy
//   server.auth.strategy('jwt_strategy', 'jwt', {
//     keys: process.env.ACCESS_TOKEN_KEY, // your ACCESS_TOKEN_KEY from .env
//     verify: {
//       aud: false,
//       iss: false,
//       sub: false,
//       maxAgeSec: parseInt(process.env.ACCESS_TOKEN_AGE) // e.g., 3600 for 1 hour
//     },
//     validate: (artifacts, request, h) => {
//       return {
//         isValid: true,
//         credentials: { id: artifacts.decoded.payload.id }
//       };
//     }
//   });

//   // Make JWT auth default for all routes (optional)
//   server.auth.default('jwt_strategy');

//   // Register your app plugins/routes
//   await server.register(openmusic);

//   await server.start();
//   console.log(`Server running on ${server.info.uri}`);
// };

// init();