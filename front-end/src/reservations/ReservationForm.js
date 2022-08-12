import React from "react";
import { useHistory } from "react-router-dom";

export default function ReservationForm({
  handleSubmit,
  reservation,
  setReservation,
}) {
  const history = useHistory();

  const handleChange = ({ target }) => {
    const value =
      target.type === "number" ? Number(target.value) : target.value;
    setReservation({ ...reservation, [target.name]: value });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    handleSubmit(event, reservation);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div className="container">
      <form onSubmit={submitHandler} className="row">
        <div className="col-lg-6 col-sm-12 col-md-12">
          <label htmlFor="first_name" className="form-label">
            First Name:
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            onChange={handleChange}
            defaultValue={reservation.first_name}
            className="form-control"
          />
        </div>
        <div className="col-lg-6 col-sm-12 col-md-12">
          <label htmlFor="last_name" className="form-label">
            Last Name:
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            onChange={handleChange}
            defaultValue={reservation.last_name}
            className="form-control"
          />
        </div>
        <div className="col-lg-6 col-sm-12 col-md-12">
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number:
          </label>
          <input
            id="mobile_number"
            name="mobile_number"
            onChange={handleChange}
            defaultValue={reservation.mobile_number}
            className="form-control"
          />
        </div>
        <div className="col-lg-6 col-sm-12 col-md-12">
          <label htmlFor="reservation_date" className="form-label">
            Reservation Date:
          </label>
          <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={handleChange}
            defaultValue={reservation.reservation_date}
            className="form-control"
          />
        </div>
        <div className="col-lg-6 col-sm-12 col-md-12">
          <label htmlFor="reservation_time" className="form-label">
            Reservation Time:
          </label>
          <input
            id="reservation_time"
            name="reservation_time"
            type="time"
            placeholder="HH:MM"
            pattern="\d{2}:\d{2}"
            onChange={handleChange}
            defaultValue={reservation.reservation_time}
            className="form-control"
          />
        </div>
        <div className="col-lg-6 col-sm-12 col-md-12">
          <label htmlFor="people" className="form-label">
            People:
          </label>
          <input
            id="people"
            name="people"
            type="number"
            placeholder="1 or greater"
            onChange={handleChange}
            defaultValue={reservation.people}
            className="form-control"
          />
        </div>
        <div className="col-6">
          <button
            className="btn btn-secondary my-3"
            onClick={handleCancel}
            style={{ width: "100%" }}
          >
            Cancel
          </button>
        </div>
        <div className="col-6">
          <button
            type="submit"
            className="btn btn-primary my-3"
            style={{ width: "100%" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
