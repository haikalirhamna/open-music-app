import routes from './routes.js';
import UserHandler from './handler.js';
import UserService from './service.js';
import { PostUserValidator, PostAuthValidator, PutAuthTokenValidator, DeleteAuthTokenValidator } from '../../validators/index.js';

export default {
  name: 'users',
  register: async (server) => {
    const service = new UserService();
    const handler = new UserHandler(service, {
      PostUserValidator: PostUserValidator,
      PostAuthValidator: PostAuthValidator,
      PutAuthTokenValidator: PutAuthTokenValidator,
      DeleteAuthTokenValidator: DeleteAuthTokenValidator
    });

    server.route(routes(handler));
  }
};
