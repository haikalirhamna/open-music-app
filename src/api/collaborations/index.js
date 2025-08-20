import routes from './routes.js';
import CollaborationsHandler from './handler.js';
import CollaborationsService from './service.js';
import { PostCollaboratorValidator, DeleteCollaboratorValidator  } from '../../validators/index.js';

export default {
  name: 'collaborator',
  register: async (server) => {
    const service = new CollaborationsService();
    const handler = new CollaborationsHandler(service, {
      PostCollaboratorValidator: PostCollaboratorValidator,
      DeleteCollaboratorValidator: DeleteCollaboratorValidator,
    });

    server.route(routes(handler));
  }
};
