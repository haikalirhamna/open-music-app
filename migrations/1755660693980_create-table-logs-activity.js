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
  pgm.createTable('logs_activity', {
    id: { type: 'varchar(50)', primaryKey: true, },
    username: { type: 'text', notNull: true, },
    title: { type: 'text', notNull: true, },
    action: { type: 'text', notNull: true, },
    time: { type: 'date', notNull: true }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('logs_activity');
};
