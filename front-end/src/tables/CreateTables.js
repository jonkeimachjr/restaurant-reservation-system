import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateTables() {
  const initialTableData = {
    table_name: "",
    capacity: 0,
  };

  const [tableData, setTableData] = useState({ ...initialTableData });
  const [tableErrors, setTableErrors] = useState(null);

  const history = useHistory();

  const handleChange = ({ target }) => {
    const value =
      target.type === "number" ? Number(target.value) : target.value;
    setTableData({ ...tableData, [target.name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const abortController = new AbortController();
    createTables(tableData, abortController.signal)
      .then((response) => {
        history.push("/dashboard");
        setTableData({ ...initialTableData });
      })
      .catch(setTableErrors);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div className="container">
      <h2
        className="d-flex justify-content-center my-3"
        style={{ fontSize: "40px" }}
      >
        Create Table
      </h2>
      <ErrorAlert error={tableErrors} />
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit} className="row">
          <label
            htmlFor="table_name"
            className="form-label"
            style={{ fontSize: "20px" }}
          >
            Table Name
          </label>
          <input
            name="table_name"
            id="table_name"
            type="text"
            onChange={handleChange}
            value={tableData.table_name}
            className="form-control mb-3"
          />
          <label
            htmlFor="capacity"
            className="form-label"
            style={{ fontSize: "20px" }}
          >
            Capacity
          </label>
          <input
            name="capacity"
            id="capacity"
            type="number"
            onChange={handleChange}
            value={tableData.capacity}
            className="form-control mb-3"
          />
          <div className="col-6">
            <button
              onClick={handleCancel}
              className="btn btn-secondary"
              style={{ width: "100%" }}
            >
              Cancel
            </button>
          </div>
          <div className="col-6">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
