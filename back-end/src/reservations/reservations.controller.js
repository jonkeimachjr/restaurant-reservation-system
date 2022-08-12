const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const list = async (req, res) => {
  const knex = req.app.get("db");
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;

  if (date) {
    res.json({ data: await service.listReservations(knex, date) });
    return;
  } else if (mobile_number) {
    res.json({
      data: await service.readReservationByMobileNumber(knex, mobile_number),
    });
    return;
  }
};

const read = (req, res) => res.json({ data: res.locals.reservation });

const create = async (req, res) => {
  const knex = req.app.get("db");

  const data = await service.createReservations(knex, res.locals.reservation);

  res.status(201).json({ data });
};

const update = async (req, res, next) => {
  const knex = req.app.get("db");

  const { status } = req.body.data;

  const reservation_id = req.params.reservation_id;

  const currentStatus = res.locals.reservation.status;

  let data;

  if (status === "cancelled") {
    data = await service.updateReservation(knex, reservation_id, status);
  } else if (currentStatus === "booked") {
    data = await service.updateReservation(knex, reservation_id, status);
  } else if (currentStatus === "seated") {
    data = await service.updateReservation(knex, reservation_id, status);
  } else if (currentStatus === "finished") {
    return next({
      status: 400,
      message: `Can not update '${currentStatus}' reservations.`,
    });
  }

  res.status(200).json({ data: data });
};

const updateReservation = async (req, res, next) => {
  const knex = req.app.get("db");

  res.json({
    data: await service.updateReservationData(knex, res.locals.reservation),
  });
};

const reservationExists = async (req, res, next) => {
  const knex = req.app.get("db");
  const reservation_id = req.params.reservation_id;
  const foundReservation = await service.getReservation(knex, reservation_id);

  if (!foundReservation) {
    return next({ status: 404, message: `${reservation_id} not found.` });
  }

  res.locals.reservation = foundReservation;
  next();
};

const validateReservation = (req, res, next) => {
  const { status } = req.body.data;

  if (
    status === "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    next();
  } else {
    return next({ status: 400, message: `Invalid status: ${status}` });
  }
};

const hasProperties = (req, res, next) => {
  if (!req.body.data) {
    next({ status: 400, message: "A 'data' field is required" });
    return;
  }

  const date = new Date();

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = req.body.data;

  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  const currentFields = new Set(Object.keys(req.body.data));

  const invalidFields = requiredFields.filter(
    (field) => !currentFields.has(field)
  );

  if (invalidFields.length > 0) {
    return next({
      status: 400,
      message: `${invalidFields.join(", ")} is required`,
    });
  }

  if (first_name.length <= 0) {
    return next({
      status: 400,
      message: `first_name needs a length greater than or equal to 1`,
    });
  }

  if (last_name.length <= 0) {
    return next({
      status: 400,
      message: `last_name needs a length greater than or equal to 1`,
    });
  }

  if (mobile_number.length <= 0) {
    return next({
      status: 400,
      message: `mobile_number needs a length greater than or equal to 1`,
    });
  }

  if (reservation_date.length <= 0) {
    return next({
      status: 400,
      message: `reservation_date needs a length greater than to equal to 1`,
    });
  }

  if (!reservation_date.match(/\d{4}\-\d{2}\-\d{2}/g)) {
    return next({ status: 400, message: `reservation_date must be a date` });
  }

  if (reservation_time.length <= 0) {
    return next({
      status: 400,
      message: `reservation_time needs a length greater than or equal to 1`,
    });
  }

  if (!reservation_time.match(/\d{2}\:\d{2}/g)) {
    return next({ status: 400, message: `reservation_time must be a time` });
  }

  if (reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message:
        "Reservations can't be placed when closed. Hours: 10:30AM - 09:30PM",
    });
  }

  if (typeof people !== "number" || people <= 0) {
    return next({
      status: 400,
      message: `people needs to be greater then or equal to 1`,
    });
  }

  if (status === "seated") {
    return next({ status: 400, message: "reservation is currently seated." });
  }

  if (status === "finished") {
    return next({ status: 400, message: "reservation is finished." });
  }

  if (new Date(reservation_date).getUTCDay() === 2) {
    return next({ status: 400, message: "We're closed on Tuesdays" });
  }

  if (
    new Date(reservation_date).valueOf() < date.valueOf() &&
    date.toUTCString().slice(0, 16) !==
      new Date(reservation_date).toUTCString().slice(0, 16)
  ) {
    return next({
      status: 400,
      message: `reservation_date must be in the future`,
    });
  }

  res.locals.reservation = req.body.data;
  next();
};

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(hasProperties), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(validateReservation),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(hasProperties),
    asyncErrorBoundary(updateReservation),
  ],
};
