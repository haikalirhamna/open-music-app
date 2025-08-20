import albumsPlugin from '../api/albums/index.js';
import songsPlugin from '../api/songs/index.js';
import userPlugin from '../api/users/index.js';
import playlistPlugin from '../api/playlists/index.js';
import collaboratorPlugin from '../api/collaborations/index.js';

export default {
  name: 'openmusic',
  version: '2.0.0',
  register: async (server) => {
    await server.register([
      albumsPlugin,
      songsPlugin,
      userPlugin,
      playlistPlugin,
      collaboratorPlugin,
    ]);
  }
};