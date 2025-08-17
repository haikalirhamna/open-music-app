export default (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUser
  },
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postUser
  },
];
