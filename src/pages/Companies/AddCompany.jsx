import { useState } from "react";
import { AlertCircle, ArrowLeft, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { companiesApi } from "../../lib/api/companies";
import { ApiError } from "../../lib/apiClient";

import "./AddCompany.css";

function AddCompany() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors([]);
    setSubmitting(true);

    try {
      await companiesApi.create(name, email);
      navigate("/companies");
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
    <div className="company-form-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/companies">Companies</Link>
          <span>/</span>
          <span>Add Company</span>
        </div>

        <div className="page-title-row">
          <div className="page-title-icon">
            <Building2 />
          </div>

          <div>
            <h1>Add Company</h1>
            <p>Register a company that can receive repairs or purchase items.</p>
          </div>
        </div>
      </div>

      <div className="card company-form-card">
        <div className="form-card-header">
          <h2>Company information</h2>
          <p>Enter the basic information for this company.</p>
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
            <label htmlFor="company-name">Company name</label>
            <input
              id="company-name"
              type="text"
              className="input"
              placeholder="e.g. ACME Rwanda"
              autoComplete="off"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company-email">Email</label>
            <input
              id="company-email"
              type="email"
              className="input"
              placeholder="contact@company.com"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <Link
              to="/companies"
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
              {submitting ? "Creating..." : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCompany;
