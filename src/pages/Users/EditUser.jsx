import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, ShieldCheck, UserPlus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { usersApi } from "../../lib/api/users";
import { ApiError } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS, PERMISSION_DESCRIPTIONS, PERMISSION_LABELS } from "../../lib/constants";

import "./AddUser.css";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [role, setRole] = useState("USER");
  const [permissions, setPermissions] = useState([]);
  const [roleError, setRoleError] = useState("");
  const [savingRole, setSavingRole] = useState(false);
  const [pendingPermission, setPendingPermission] = useState(null);
  const [permissionError, setPermissionError] = useState("");

  const isEditingSelf = currentUser?.id === Number(id);

  const loadUser = () =>
    usersApi.getById(id).then((user) => {
      setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
      setRole(user.role);
      setPermissions(user.permissions ?? []);
    });

  useEffect(() => {
    let cancelled = false;

    loadUser()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleRoleSubmit = async (event) => {
    event.preventDefault();
    setRoleError("");
    setSavingRole(true);

    try {
      await usersApi.changeRole(id, role);
      await loadUser();
    } catch (err) {
      setRoleError(err instanceof ApiError ? err.message : "Failed to change role.");
    } finally {
      setSavingRole(false);
    }
  };

  const togglePermission = async (permission, currentlyGranted) => {
    setPermissionError("");
    setPendingPermission(permission);

    try {
      if (currentlyGranted) {
        await usersApi.revokePermission(id, permission);
        setPermissions((current) => current.filter((p) => p !== permission));
      } else {
        await usersApi.grantPermission(id, permission);
        setPermissions((current) => [...current, permission]);
      }
    } catch (err) {
      setPermissionError(err instanceof ApiError ? err.message : "Failed to update permission.");
    } finally {
      setPendingPermission(null);
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
          <h2>Role</h2>
          <p>
            Superadmins have unrestricted access to every module and can manage other users.
          </p>
        </div>

        {isEditingSelf && (
          <div
            className="banner"
            role="status"
            style={{ borderColor: "rgb(217 119 6 / 25%)", background: "rgb(217 119 6 / 6%)", color: "#92400e" }}
          >
            <AlertCircle />
            <span>You're editing your own account. You can't demote yourself if you're the last superadmin.</span>
          </div>
        )}

        <form onSubmit={handleRoleSubmit}>
          {roleError && (
            <div
              className="banner banner-error"
              role="alert"
            >
              <AlertCircle />
              <span>{roleError}</span>
            </div>
          )}

          <div className="form-group">
            <select
              className="input"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="USER">User</option>
              <option value="SUPERADMIN">Superadmin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-outline"
            disabled={savingRole}
          >
            <ShieldCheck />
            {savingRole ? "Saving..." : "Save role"}
          </button>
        </form>
      </div>

      {role !== "SUPERADMIN" && (
        <div className="card user-form-card">
          <div className="form-card-header">
            <h2>Permissions</h2>
            <p>Choose which sections of the system this user can access.</p>
          </div>

          {permissionError && (
            <div
              className="banner banner-error"
              role="alert"
            >
              <AlertCircle />
              <span>{permissionError}</span>
            </div>
          )}

          <div className="permission-list">
            {PERMISSIONS.map((permission) => {
              const granted = permissions.includes(permission);
              return (
                <label
                  key={permission}
                  className="permission-item"
                >
                  <input
                    type="checkbox"
                    checked={granted}
                    disabled={pendingPermission === permission}
                    onChange={() => togglePermission(permission, granted)}
                  />
                  <div>
                    <span className="permission-item-title">{PERMISSION_LABELS[permission]}</span>
                    <span className="permission-item-description">{PERMISSION_DESCRIPTIONS[permission]}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

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
