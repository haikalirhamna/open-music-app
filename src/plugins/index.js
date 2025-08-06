import albumsPlugin from '../api/albums/index.js';
import songsPlugin from '../api/songs/index.js';

export default {
  name: 'openmusic',
  version: '1.0.0',
  register: async (server) => {
    await server.register([
      albumsPlugin,
      songsPlugin
    ]);
  }
};