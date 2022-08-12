import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTables,
  clearTable,
  cancelReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { next, previous, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationErrors] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableErrors, setTableErrors] = useState(null);

  const query = useQuery();
  const [date, setDate] = useState(query.get("date") || today());

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationErrors(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationErrors);
    listTables(abortController.signal).then(setTables).catch(setTableErrors);
    return () => abortController.abort();
  }

  const finishReservation = (table_id) => {
    const abortController = new AbortController();

    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      clearTable(table_id, abortController.signal)
        .then(loadDashboard)
        .catch(setTableErrors);
    }

    return () => abortController.abort();
  };

  const handleCancelReservation = (event, reservation_id) => {
    event.preventDefault();
    const abortController = new AbortController();

    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      cancelReservation(reservation_id, abortController.signal)
        .then(loadDashboard)
        .catch(setReservationErrors);
    }
    return () => abortController.abort();
  };

  return (
    <main>
      <div className="my-3 row">
        <div className="col-12 d-flex justify-content-center">
          <h1>Dashboard</h1>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <h4 className="mb-0">Reservations for date: {date}</h4>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-outline-primary"
          onClick={() => setDate(previous(date))}
        >
          Prev
        </button>
        <button
          className="btn btn-success mx-1"
          onClick={() => setDate(today())}
        >
          Today
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => setDate(next(date))}
        >
          Next
        </button>
      </div>
      <div className="d-md-flex mb-3 row">
        <div className="col-12">
          <h5>
            <strong>Reservations</strong>
          </h5>
        </div>
        <ErrorAlert error={reservationsError || tableErrors} />
        <div className="d-flex flex-wrap">
          {reservations.map(
            (
              {
                reservation_id,
                first_name,
                last_name,
                mobile_number,
                reservation_date,
                reservation_time,
                people,
                status,
              },
              index
            ) => {
              return status !== "cancelled" ? (
                <div
                  className="card m-2 col-sm-12 col-md-11 col-lg border-dark p-0"
                  key={reservation_id}
                >
                  <p
                    className="card-title d-flex justify-content-center my-3"
                    style={{ fontSize: "20px" }}
                  >
                    <strong>
                      {first_name}, {last_name}
                    </strong>
                  </p>
                  <div className="card-body" style={{ fontSize: "18px" }}>
                    <p>Reservation #: {reservation_id}</p>
                    <p>Mobile Number: {mobile_number}</p>
                    <p>Reservation Date: {reservation_date}</p>
                    <p>Reservation Time: {reservation_time}</p>
                    <p>People: {people}</p>
                    <p data-reservation-id-status={reservation_id}>
                      Status: {status}
                    </p>
                  </div>
                  <div>
                    {status === "booked" ? (
                      <div className="card-footer">
                        <a
                          className="btn btn-success col-12 my-1"
                          href={`/reservations/${reservation_id}/seat`}
                        >
                          Seat
                        </a>
                        <a
                          className="btn btn-secondary col-12"
                          href={`/reservations/${reservation_id}/edit`}
                        >
                          Edit
                        </a>
                        <button
                          className="btn btn-danger col-12 my-1"
                          onClick={(event) =>
                            handleCancelReservation(event, reservation_id)
                          }
                          data-reservation-id-cancel={reservation_id}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null;
            }
          )}
        </div>
        <div className="col-12">
          <h5>
            <strong>Tables</strong>
          </h5>
        </div>
        <div className="d-flex flex-wrap flex-lg-nowrap">
          {tables.map(({ table_id, table_name, reservation_id, capacity }) => {
            return (
              <div
                className="card border-dark m-2 col-md-5 col-sm-12 col-lg-3 col-xl-4 p-0"
                key={table_id}
              >
                <p
                  className="card-title d-flex justify-content-center"
                  style={{ fontSize: "20px" }}
                >
                  <strong>{table_name}</strong>
                </p>
                <div className="card-body" style={{ fontSize: "18px" }}>
                  <p>Table #: {table_id}</p>
                  <p>Capacity: {capacity}</p>
                  <p data-table-id-status={table_id}>
                    {reservation_id !== null ? "occupied" : "free"}
                  </p>
                </div>
                {reservation_id !== null ? (
                  <button
                    className="btn btn-success col-12"
                    onClick={() => finishReservation(table_id)}
                    data-table-id-finish={table_id}
                  >
                    Finish
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
