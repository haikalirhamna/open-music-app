export default (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylist,
    options: {
      auth: 'openmusic_jwt',
    }
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylist,
    options: {
      auth: 'openmusic_jwt',
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylists,
    options: {
      auth: 'openmusic_jwt',
    }
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getPlaylistWithSongs,
    options: {
      auth: 'openmusic_jwt',
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylist,
    options: {
      auth: 'openmusic_jwt',
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongFromPlaylist,
    options: {
      auth: 'openmusic_jwt',
    }
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getActivity,
    options: {
      auth: 'openmusic_jwt',
    }
  },
];
