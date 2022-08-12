import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { readReservation, updateReservation } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
  const [reservation, setReservation] = useState({});
  const [reservationErrors, setReservationErrors] = useState(null);

  const reservation_id = useParams();

  const history = useHistory();

  const findReservation = () => {
    const abortController = new AbortController();

    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationErrors);

    return () => abortController.abort();
  };

  useEffect(findReservation, [reservation_id]);

  const handleSubmit = (event, reservationData) => {
    event.preventDefault();
    const abortController = new AbortController();

    updateReservation(reservationData, abortController.signal)
      .then((response) => response)
      .then(() =>
        history.push(`/dashboard?date=${reservationData.reservation_date}`)
      )
      .catch(setReservationErrors);

    return () => abortController.abort();
  };

  return (
    <div>
      <div className="d-flex justify-content-center my-3">
        <h2>Edit Reservation</h2>
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
