import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Edit,
  Inbox,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { usersApi } from "../../lib/api/users";
import { ApiError } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";

import "./Users.css";

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      setUsers(await usersApi.getAll());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  const handleDelete = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      window.alert("You cannot delete your own account while signed in.");
      return;
    }

    if (!window.confirm(`Delete "${targetUser.firstName} ${targetUser.lastName}"?`)) {
      return;
    }

    try {
      await usersApi.remove(targetUser.id);
      setUsers((current) => current.filter((existing) => existing.id !== targetUser.id));
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to delete user.");
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return users;
    }
    return users.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [users, search]);

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Users</h1>
          <p>Manage who has access to the system.</p>
        </div>

        <Link
          to="/users/new"
          className="btn btn-primary"
        >
          <Plus />
          Add User
        </Link>
      </div>

      <div className="users-card card">
        <div className="users-toolbar">
          <div className="user-search">
            <Search className="user-search-icon" />

            <input
              type="search"
              className="input"
              placeholder="Search users..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {error && (
          <div
            className="banner banner-error"
            style={{ margin: "1rem" }}
            role="alert"
          >
            <AlertCircle />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="state-block">
            <span className="spinner" />
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="state-block">
            <Inbox />
            {users.length === 0 ? "No users yet. Add your first user to get started." : "No users match your search."}
          </div>
        ) : (
          <div className="user-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-name">
                        <div className="avatar avatar-sm">
                          {`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()}
                        </div>

                        <span className="user-title">
                          {user.firstName} {user.lastName}
                          {user.id === currentUser?.id && (
                            <span className="user-you-badge">You</span>
                          )}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="user-email">
                        {user.email}
                      </span>
                    </td>

                    <td className="actions-column">
                      <ActionsMenu label={`Actions for ${user.firstName} ${user.lastName}`}>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="dropdown-item"
                        >
                          <Edit />
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="dropdown-item dropdown-item-destructive"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 />
                          Delete
                        </button>
                      </ActionsMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
