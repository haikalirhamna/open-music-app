export default (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUser
  },
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuth
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuth
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuth
  },
];
