import routes from './routes.js';
import AlbumHandler from './handler.js';
import AlbumService from './service.js';
import { AlbumValidator } from '../../validators/index.js';

export default {
  name: 'albums',
  register: async (server) => {
    const service = new AlbumService();
    const handler = new AlbumHandler(service, {
      AlbumValidator: AlbumValidator,
    });

    server.route(routes(handler));
  }
};
