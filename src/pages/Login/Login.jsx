import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/apiClient";

import "./Login.css";

function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname ?? "/dashboard";
    return (
      <Navigate
        to={destination}
        replace
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">

        <div className="login-header">
          <div className="login-logo">
            A
          </div>

          <h1>Welcome to ADMS</h1>

          <p>
            Sign in to manage your organization's assets.
          </p>
        </div>

        <div className="login-card">
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
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                className="input"
                placeholder="name@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">
                  Password
                </label>
              </div>

              <input
                id="password"
                type="password"
                className="input"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary login-button"
              disabled={submitting}
            >
              {submitting && <span className="spinner" />}
              {submitting ? "Signing in..." : "Sign in"}
            </button>

          </form>
        </div>

        <p className="login-footer">
          ADMS · Asset Disposal Management System
        </p>

      </div>
    </main>
  );
}

export default Login;
