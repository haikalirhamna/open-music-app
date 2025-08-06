import routes from './routes.js';
import SongHandler from './handler.js';
import SongService from './service.js';
import { SongValidator, IdValidator } from '../../validators/index.js';

export default {
  name: 'songs',
  register: async (server) => {
    const service = new SongService();
    const handler = new SongHandler(service, {
      SongValidator: SongValidator,
      IdValidator: IdValidator
    });

    server.route(routes(handler));
  }
};
