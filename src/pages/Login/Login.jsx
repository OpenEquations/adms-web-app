import "./Login.css";

function Login() {
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
          <form>

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
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">
                  Password
                </label>

                <a href="#">
                  Forgot password?
                </a>
              </div>

              <input
                id="password"
                type="password"
                className="input"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <div className="remember-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary login-button"
            >
              Sign in
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