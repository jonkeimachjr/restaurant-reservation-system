const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const list = async (req, res) => {
  const knex = req.app.get("db");

  res.json({ data: await service.listTables(knex) });
};

const read = (req, res) => {
  res.json({ data: res.locals.table });
};

const update = async (req, res, next) => {
  if (!req.body.data) {
    return next({ status: 400, message: `'data' key is required` });
  }

  const { reservation_id } = req.body.data;

  const knex = req.app.get("db");

  const table = res.locals.table;

  if (!reservation_id) {
    return next({ status: 400, message: `'reservation_id' key is required` });
  }

  const reservation = await reservationService.getReservation(
    knex,
    reservation_id
  );

  if (!reservation) {
    return next({ status: 404, message: `${reservation_id} not found.` });
  }

  if (table.reservation_id !== null) {
    return next({
      status: 400,
      message: `${table.table_name} is currently occupied by ${reservation.reservation_id}`,
    });
  }

  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: `${table.table_name} does not have a capacity to seat ${reservation.people} people.`,
    });
  }

  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: `Reservation has already been seated.`,
    });
  }
  await reservationService.updateReservation(
    knex,
    reservation.reservation_id,
    "seated"
  );
  res
    .status(200)
    .json({
      data: await service.updateTable(
        knex,
        table.table_id,
        reservation.reservation_id
      ),
    });
};

const create = async (req, res) => {
  const knex = req.app.get("db");

  const newTable = {
    ...res.locals.newTable,
  };

  const createdTable = await service.createTable(knex, newTable);
  if (createdTable) {
    res.status(201).json({ data: createdTable });
  }
};

const unreserve = async (req, res, next) => {
  const knex = req.app.get("db");

  const { table_id, table_name, reservation_id } = res.locals.table;

  if (reservation_id === null) {
    return next({
      status: 400,
      message: `'${table_name}' is currently not occupied.`,
    });
  }

  await reservationService.updateReservation(knex, reservation_id, "finished");
  res.status(200).json({ data: await service.unreserveTable(knex, table_id) });
};

const tableExists = async (req, res, next) => {
  const knex = req.app.get("db");

  const table_id = req.params.table_id;

  const foundTable = await service.readTable(knex, table_id);

  if (!foundTable) {
    return next({ status: 404, message: `${table_id} not found.` });
  }

  res.locals.table = foundTable;
  next();
};

const hasProperties = (req, res, next) => {
  if (!req.body.data) {
    return next({ status: 400, message: `"data" key is required.` });
  }

  const { table_name, capacity } = req.body.data;

  if (!table_name || table_name.length <= 1) {
    return next({
      status: 400,
      message: `"table_name" key is required and must have a length greater than 1.`,
    });
  }

  if (!capacity || typeof capacity !== "number" || capacity === 0) {
    return next({
      status: 400,
      message: `"capacity" key is required and must be a integer greater than or equal to 1.`,
    });
  }

  res.locals.newTable = req.body.data;
  next();
};

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  create: [asyncErrorBoundary(hasProperties), asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(update)],
  unreserve: [asyncErrorBoundary(tableExists), asyncErrorBoundary(unreserve)],
};
