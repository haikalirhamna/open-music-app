/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: { type: 'varchar(50)', notNull: true, primaryKey: true, },
    playlistId: { type: 'varchar(50)', notNull: true, references: 'playlists(id)', onDelete: 'CASCADE', },
    songId: { type: 'varchar(50)', notNull: true, references: 'songs(id)', onDelete: 'CASCADE', },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
