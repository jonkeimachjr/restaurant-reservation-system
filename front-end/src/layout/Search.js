import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Search() {
  const [reservations, setReservations] = useState([]);
  const [reservationErrors, setReservationErrors] = useState(null);
  const [mobile_number, setMobileNumber] = useState("");

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .then(() =>
        reservations.length <= 0
          ? setReservationErrors({ message: "No reservations found." })
          : setReservationErrors(null)
      )
      .catch(setReservationErrors);
    return () => abortController.abort();
  };

  return (
    <div>
      <div className="d-flex justify-content-center my-3">
        <h2>
          <strong>Search for reservations by mobile number</strong>
        </h2>
      </div>
      <form
        onSubmit={handleSearch}
        className="row d-flex justify-content-center"
      >
        <div className="card px-3">
          <label
            htmlFor="mobile_number"
            className="form-label my-3 card-title"
            style={{ fontSize: "20px" }}
          >
            <strong>Enter a mobile number of a reservation</strong>
          </label>
          <input
            name="mobile_number"
            onChange={handleChange}
            value={mobile_number}
            className="form-control card-body"
            placeholder="1235551231"
          />
          <button className="btn btn-primary my-3" type="submit">
            Find
          </button>
        </div>
      </form>
      <ErrorAlert error={reservationErrors} />
      <div className="row">
        <h2 className="col-12">
          <strong>Reservations</strong>
        </h2>
        {reservations.map(
          (
            {
              reservation_id,
              first_name,
              last_name,
              reservation_date,
              reservation_time,
              people,
              status,
              mobile_number,
            },
            index
          ) => {
            return (
              <div
                className="card m-3 col-sm-12 col-md-11 col-lg-4 border-dark"
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
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
