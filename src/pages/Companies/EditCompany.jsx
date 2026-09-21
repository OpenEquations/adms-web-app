import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Building2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { companiesApi } from "../../lib/api/companies";
import { ApiError } from "../../lib/apiClient";

import "./AddCompany.css";

function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    companiesApi
      .getById(id)
      .then((company) => {
        if (cancelled) return;
        setName(company.name);
        setEmail(company.email);
      })
      .catch((err) => {
        if (cancelled) return;
        setNotFound(true);
        setError(err instanceof ApiError ? err.message : "Failed to load company.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Sequential, not Promise.all: each endpoint reads the full company,
      // changes one field, and writes the full record back, so concurrent
      // calls can let one silently revert the other via a stale snapshot.
      await companiesApi.changeName(id, name);
      await companiesApi.changeEmail(id, email);
      navigate("/companies");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="company-form-page">
        <div className="state-block">
          <span className="spinner" />
          Loading company...
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="company-form-page">
        <div
          className="banner banner-error"
          role="alert"
        >
          <AlertCircle />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="company-form-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/companies">Companies</Link>
          <span>/</span>
          <span>Edit Company</span>
        </div>

        <div className="page-title-row">
          <div className="page-title-icon">
            <Building2 />
          </div>

          <div>
            <h1>Edit Company</h1>
            <p>Update this company's details.</p>
          </div>
        </div>
      </div>

      <div className="card company-form-card">
        <div className="form-card-header">
          <h2>Company information</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              className="banner banner-error"
              role="alert"
            >
              <AlertCircle />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="company-name">Company name</label>
            <input
              id="company-name"
              type="text"
              className="input"
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
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCompany;
