import { useState } from "react";
import { AlertCircle, ArrowLeft, ClipboardList } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { tendersApi } from "../../lib/api/tenders";
import { ApiError } from "../../lib/apiClient";
import { TENDER_TYPES, TENDER_TYPE_LABELS } from "../../lib/constants";

import "./AddTender.css";

function AddTender() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors([]);
    setSubmitting(true);

    try {
      const created = await tendersApi.create({ title, description, type: type || null });
      navigate(`/disposal-requests/${created.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.details ?? []);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tender-form-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/disposal-requests">Disposal Requests</Link>
          <span>/</span>
          <span>New Disposal Request</span>
        </div>

        <div className="page-title-row">
          <div className="page-title-icon">
            <ClipboardList />
          </div>

          <div>
            <h1>New Disposal Request</h1>
            <p>Start a repair or selling tender for one or more assets.</p>
          </div>
        </div>
      </div>

      <div className="card tender-form-card">
        <div className="form-card-header">
          <h2>Disposal request information</h2>
          <p>Items can be added once the request is created.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              className="banner banner-error"
              role="alert"
            >
              <AlertCircle />
              <div>
                <span>{error}</span>
                {fieldErrors.length > 0 && (
                  <ul>
                    {fieldErrors.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="tender-title">Title</label>
            <input
              id="tender-title"
              type="text"
              className="input"
              placeholder="e.g. Q3 office equipment disposal"
              autoComplete="off"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tender-description">Description</label>
            <textarea
              id="tender-description"
              className="input textarea"
              placeholder="Describe what this disposal request covers..."
              rows="4"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tender-type">Type</label>
            <select
              id="tender-type"
              className="input"
              value={type}
              onChange={(event) => setType(event.target.value)}
              required
            >
              <option
                value=""
                disabled
              >
                Select type
              </option>
              {TENDER_TYPES.map((tenderType) => (
                <option
                  key={tenderType}
                  value={tenderType}
                >
                  {TENDER_TYPE_LABELS[tenderType]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <Link
              to="/disposal-requests"
              className="btn btn-outline"
            >
              <ArrowLeft />
              Cancel
            </Link>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting && <span className="spinner" />}
              {submitting ? "Creating..." : "Create Disposal Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTender;
