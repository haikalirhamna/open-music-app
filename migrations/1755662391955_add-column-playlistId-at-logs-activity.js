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
  pgm.addColumn('logs_activity', {
    playlistId: {
      type: 'varchar(50)',
      notNull: true,
    },
  });

  // Add foreign key constraint
  pgm.addConstraint('logs_activity', 'fk_logs_activity.playlistId_playlists.id', {
    foreignKeys: {
      columns: 'playlistId',
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // delete column
  pgm.dropConstraint('logs_activity', 'fk_logs_activity.playlistId_playlists.id');
  // delete foreign keys
  pgm.dropColumn('logs_activity', 'playlistId');
};
