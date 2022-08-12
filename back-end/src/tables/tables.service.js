const listTables = (knex) =>
  knex("tables").select("*").orderBy("table_name", "asc");

const readTable = (knex, table_id) =>
  knex("tables").select("*").where({ table_id }).first();

const createTable = (knex, newTable) =>
  knex("tables")
    .insert(newTable)
    .returning("*")
    .then((result) => result[0]);

const updateTable = (knex, table_id, reservation_id) =>
  knex("tables").update({ reservation_id }).where({ table_id }).returning("*");

const unreserveTable = (knex, table_id) =>
  knex("tables")
    .update({ reservation_id: null })
    .where({ table_id })
    .returning("*");

module.exports = {
  listTables,
  readTable,
  createTable,
  updateTable,
  unreserveTable,
};
