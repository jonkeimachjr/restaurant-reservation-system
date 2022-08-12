import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

export default function CreateReservation() {
  const initialReservation = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [reservation, setReservation] = useState({ ...initialReservation });
  const [reservationErrors, setReservationErrors] = useState(null);

  const history = useHistory();

  const handleSubmit = (event, reservationData) => {
    event.preventDefault();

    const abortController = new AbortController();

    createReservations(reservationData, abortController.signal)
      .then(() =>
        history.push(`/dashboard?date=${reservationData.reservation_date}`)
      )
      .catch(setReservationErrors);
    return () => abortController.abort();
  };

  return (
    <div>
      <div className="d-flex justify-content-center my-3">
        <h1>Create Reservation</h1>
      </div>
      <ErrorAlert error={reservationErrors} />
      <ReservationForm
        handleSubmit={handleSubmit}
        reservation={reservation}
        setReservation={setReservation}
      />
    </div>
  );
}
