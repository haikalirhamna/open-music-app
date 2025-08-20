import routes from './routes.js';
import PlaylistHandler from './handler.js';
import PlaylistService from './service.js';
import { PostPlaylistValidator, PostPlaylistSongValidator  } from '../../validators/index.js';

export default {
  name: 'playlist',
  register: async (server) => {
    const service = new PlaylistService();
    const handler = new PlaylistHandler(service, {
      PostPlaylistValidator: PostPlaylistValidator,
      PostPlaylistSongValidator: PostPlaylistSongValidator,
    });

    server.route(routes(handler));
  }
};
