const listReservations = (knex, reservation_date) =>
  knex("reservations")
    .select("*")
    .whereNot("status", "finished")
    .andWhere({ reservation_date })
    .orderBy("reservation_time", "asc");

const getReservation = (knex, reservation_id) =>
  knex("reservations").select("*").where({ reservation_id }).first();

const createReservations = (knex, newReservation) =>
  knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((result) => result[0]);

const updateReservationData = (knex, reservation) =>
  knex("reservations")
    .update(reservation)
    .where({ reservation_id: reservation.reservation_id })
    .returning("*")
    .then((result) => result[0]);

const updateReservation = (knex, reservation_id, status) =>
  knex("reservations")
    .update({ status: status })
    .where({ reservation_id })
    .returning("*")
    .then((result) => result[0]);

const readReservationByMobileNumber = (knex, mobile_number) =>
  knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");

module.exports = {
  listReservations,
  createReservations,
  getReservation,
  updateReservation,
  readReservationByMobileNumber,
  updateReservationData,
};
