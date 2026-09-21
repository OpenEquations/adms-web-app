import { useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound, User } from "lucide-react";

import { usersApi } from "../../lib/api/users";
import { ApiError } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";

import "../Users/AddUser.css";

function MyAccount() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    try {
      // Sequential, not Promise.all: each endpoint reads the full user,
      // changes one field, and writes the full record back, so concurrent
      // calls can let one silently revert the other via a stale snapshot.
      await usersApi.changeName(user.id, form.firstName, form.lastName);
      await usersApi.changeEmail(user.id, form.email);
      updateUser({ firstName: form.firstName, lastName: form.lastName, email: form.email });
      setSuccess(true);
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
      await usersApi.changePassword(user.id, password);
      setPassword("");
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="user-form-page">
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-title-icon">
            <User />
          </div>

          <div>
            <h1>My Account</h1>
            <p>Manage your own personal information and login credentials.</p>
          </div>
        </div>
      </div>

      <div className="card user-form-card">
        <div className="form-card-header">
          <h2>Personal information</h2>
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

          {success && (
            <div
              className="banner"
              role="status"
              style={{ borderColor: "rgb(4 120 87 / 25%)", background: "rgb(4 120 87 / 6%)", color: "#047857" }}
            >
              <CheckCircle2 />
              <span>Your information has been updated.</span>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="account-first-name">First name</label>
              <input
                id="account-first-name"
                type="text"
                className="input"
                autoComplete="given-name"
                value={form.firstName}
                onChange={updateField("firstName")}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="account-last-name">Last name</label>
              <input
                id="account-last-name"
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
            <label htmlFor="account-email">Email</label>
            <input
              id="account-email"
              type="email"
              className="input"
              autoComplete="off"
              value={form.email}
              onChange={updateField("email")}
              required
            />
          </div>

          <div className="form-actions">
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
          <p>Set a new password for your account.</p>
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
            <label htmlFor="account-new-password">New password</label>
            <input
              id="account-new-password"
              type="password"
              className="input"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div
            className="form-actions"
            style={{ justifyContent: "flex-start" }}
          >
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

export default MyAccount;
