const { onUpdateTrigger } = require("../../../../knexfile");

exports.up = (knex) =>
  knex.schema
    .createTable("follow", (t) => {
      t.increments("id").primary();
      t.string("ticker_symbol").notNull();
      t.specificType("ip", "inet").notNull();
      t.timestamps(false, true);
    })
    .then(() => knex.raw(onUpdateTrigger("follow")));

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("follow");
};
