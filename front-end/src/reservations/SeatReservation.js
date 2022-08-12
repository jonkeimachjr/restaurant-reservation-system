import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, seatReservation } from "../utils/api";

export default function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [tableErrors, setTableErrors] = useState(null);

  const history = useHistory();
  const reservation_id = useParams();
  let table_id;

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTableErrors);
    return () => abortController.abort();
  }, []);

  const handleSelection = (event) => {
    table_id = event.target.value;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const abortController = new AbortController();

    seatReservation(reservation_id, table_id, abortController.signal)
      .then(() => history.push("/dashboard"))
      .catch(setTableErrors);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.back();
  };

  return (
    <div className="row">
      <div className="col-12 d-flex justify-content-center my-3">
        <h2>
          <strong>Seat Reservation</strong>
        </h2>
      </div>
      <div className="col-12">
        <ErrorAlert error={tableErrors} />
      </div>
      <div className="col-12 d-flex justify-content-center">
        <form onSubmit={handleSubmit} className="card p-3">
          <div className="col-12">
            <label htmlFor="table_id" className="form-label">
              Select a table to seat reservation
            </label>
            <select
              name="table_id"
              onChange={handleSelection}
              className="col-12 mb-3 form-control"
            >
              {tables.map(({ table_id, table_name, capacity }, index) => (
                <option key={index} value={table_id}>
                  {table_name} - {capacity}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 d-flex justify-content-center">
            <div className="col-6">
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
                style={{ width: "100%" }}
              >
                Cancel
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-primary"
                type="submit"
                style={{ width: "100%" }}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
