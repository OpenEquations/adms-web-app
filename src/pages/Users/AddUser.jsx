import { useState } from "react";
import { AlertCircle, ArrowLeft, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { usersApi } from "../../lib/api/users";
import { ApiError } from "../../lib/apiClient";

import "./AddUser.css";

const emptyForm = { firstName: "", lastName: "", email: "", password: "" };

function AddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors([]);
    setSubmitting(true);

    try {
      await usersApi.create(form);
      navigate("/users");
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
    <div className="user-form-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/users">Users</Link>
          <span>/</span>
          <span>Add User</span>
        </div>

        <div className="page-title-row">
          <div className="page-title-icon">
            <UserPlus />
          </div>

          <div>
            <h1>Add User</h1>
            <p>Create a new account with access to this system.</p>
          </div>
        </div>
      </div>

      <div className="card user-form-card">
        <div className="form-card-header">
          <h2>User information</h2>
          <p>Enter the basic information for this user.</p>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first-name">First name</label>
              <input
                id="first-name"
                type="text"
                className="input"
                autoComplete="given-name"
                value={form.firstName}
                onChange={updateField("firstName")}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last-name">Last name</label>
              <input
                id="last-name"
                type="text"
                className="input"
                autoComplete="family-name"
                value={form.lastName}
                onChange={updateField("lastName")}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="user-email">Email</label>
            <input
              id="user-email"
              type="email"
              className="input"
              autoComplete="off"
              value={form.email}
              onChange={updateField("email")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-password">Password</label>
            <input
              id="user-password"
              type="password"
              className="input"
              autoComplete="new-password"
              value={form.password}
              onChange={updateField("password")}
              required
            />
            <span className="form-help">
              The user will use this password to sign in.
            </span>
          </div>

          <div className="form-actions">
            <Link
              to="/users"
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
              {submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
