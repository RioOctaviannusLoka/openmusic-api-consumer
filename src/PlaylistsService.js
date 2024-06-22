const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const playlistQuery = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);
    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists
      LEFT JOIN playlists_songs ON playlists_songs.playlist_id = playlists.id
      LEFT JOIN songs ON playlists_songs.song_id = songs.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(songsQuery);
    const songs = songsResult.rows;

    const exportPlaylist = {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        songs: songs,
      },
    };

    return exportPlaylist;
  }
}

module.exports = PlaylistsService;
