import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, UserPlus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { usersApi } from "../../lib/api/users";
import { ApiError } from "../../lib/apiClient";

import "./AddUser.css";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;

    usersApi
      .getById(id)
      .then((user) => {
        if (cancelled) return;
        setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
      })
      .catch((err) => {
        if (cancelled) return;
        setNotFound(true);
        setError(err instanceof ApiError ? err.message : "Failed to load user.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await Promise.all([
        usersApi.changeName(id, form.firstName, form.lastName),
        usersApi.changeEmail(id, form.email),
      ]);
      navigate("/users");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    setChangingPassword(true);

    try {
      await usersApi.changePassword(id, password);
      setPassword("");
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="user-form-page">
        <div className="state-block">
          <span className="spinner" />
          Loading user...
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="user-form-page">
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
    <div className="user-form-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/users">Users</Link>
          <span>/</span>
          <span>Edit User</span>
        </div>

        <div className="page-title-row">
          <div className="page-title-icon">
            <UserPlus />
          </div>

          <div>
            <h1>Edit User</h1>
            <p>Update this user's details.</p>
          </div>
        </div>
      </div>

      <div className="card user-form-card">
        <div className="form-card-header">
          <h2>User information</h2>
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
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="card user-form-card">
        <div className="form-card-header">
          <h2>Change password</h2>
          <p>Set a new password for this user.</p>
        </div>

        <form onSubmit={handlePasswordSubmit}>
          {passwordError && (
            <div
              className="banner banner-error"
              role="alert"
            >
              <AlertCircle />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div
              className="banner"
              role="status"
              style={{ borderColor: "rgb(4 120 87 / 25%)", background: "rgb(4 120 87 / 6%)", color: "#047857" }}
            >
              <CheckCircle2 />
              <span>Password updated.</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              className="input"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-actions" style={{ justifyContent: "flex-start" }}>
            <button
              type="submit"
              className="btn btn-outline"
              disabled={changingPassword || !password}
            >
              <KeyRound />
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
