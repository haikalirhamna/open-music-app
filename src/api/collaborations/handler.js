import ClientError from '../../exceptions/clientError.js';
export default class CollaborationsHandler {
  constructor(service, { PostCollaboratorValidator, DeleteCollaboratorValidator }) {
    this._service = service;
    this._PostCollaboratorValidator = PostCollaboratorValidator;
    this._DeleteCollaboratorValidator = DeleteCollaboratorValidator;

    this.postCollaboration = this.postCollaboration.bind(this);
    this.deleteCollaboration = this.deleteCollaboration.bind(this);
  }

  async postCollaboration(request, h) {
    const { error } = this._PostCollaboratorValidator.validate(request.payload);
    if (error) throw new ClientError(error.details[0].message);

    const { userId: credentialId } = request.auth.credentials;
    const collaborationId = await this._service.addCollaborator({
      owner: credentialId,
      playlistId: request.payload.playlistId,
      userId: request.payload.userId
    });

    return h.response({
      status: 'success',
      data: {
        collaborationId
      },
    }).code(201);
  }

  async deleteCollaboration(request, h) {
    const { error } = this._DeleteCollaboratorValidator.validate(request.payload);
    if (error) throw new ClientError(error.details[0].message);

    const { userId: credentialId } = request.auth.credentials;
    const collaborator = await this._service.deleteCollaborator({
      owner: credentialId,
      playlistId: request.payload.playlistId,
      userId: request.payload.userId
    });

    return h.response({
      status: 'success',
      message: 'Collaborator removed from playlist',
    }).code(200);
  }
}