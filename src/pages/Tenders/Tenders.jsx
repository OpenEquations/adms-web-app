import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ClipboardList,
  Eye,
  Inbox,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { tendersApi } from "../../lib/api/tenders";
import { ApiError } from "../../lib/apiClient";
import { TENDER_STATUS_LABELS, TENDER_TYPE_LABELS, statusToClassName } from "../../lib/constants";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";

import "./Tenders.css";

function Tenders() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadTenders = async () => {
    setLoading(true);
    setError("");

    try {
      setTenders(await tendersApi.getAll());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load disposal requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTenders();
  }, []);

  const handleDelete = async (tender) => {
    if (!window.confirm(`Delete "${tender.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await tendersApi.remove(tender.id);
      setTenders((current) => current.filter((existing) => existing.id !== tender.id));
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to delete disposal request.");
    }
  };

  const filteredTenders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return tenders;
    }
    return tenders.filter((tender) => tender.title.toLowerCase().includes(query));
  }, [tenders, search]);

  return (
    <div className="tenders-page">
      <div className="tenders-header">
        <div>
          <h1>Disposal Requests</h1>
          <p>
            Manage repair and selling tenders for assets leaving active use.
          </p>
        </div>

        <Link
          to="/disposal-requests/new"
          className="btn btn-primary"
        >
          <Plus />
          New Disposal Request
        </Link>
      </div>

      <div className="tenders-card card">
        <div className="tenders-toolbar">
          <div className="tender-search">
            <Search className="tender-search-icon" />

            <input
              type="search"
              className="input"
              placeholder="Search disposal requests..."
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
            Loading disposal requests...
          </div>
        ) : filteredTenders.length === 0 ? (
          <div className="state-block">
            <Inbox />
            {tenders.length === 0
              ? "No disposal requests yet. Create your first one to get started."
              : "No disposal requests match your search."}
          </div>
        ) : (
          <div className="tender-table-wrapper">
            <table className="tender-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Items</th>
                  <th>Winner</th>
                  <th>Status</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTenders.map((tender) => (
                  <tr key={tender.id}>
                    <td>
                      <Link
                        to={`/disposal-requests/${tender.id}`}
                        className="tender-name"
                      >
                        <div className="tender-icon">
                          <ClipboardList />
                        </div>

                        <span className="tender-title">
                          {tender.title}
                        </span>
                      </Link>
                    </td>

                    <td>
                      <span className="tender-type">
                        {TENDER_TYPE_LABELS[tender.type] ?? tender.type}
                      </span>
                    </td>

                    <td>
                      <span className="tender-item-count">
                        {tender.items.length}
                      </span>
                    </td>

                    <td>
                      <span className="tender-winner">
                        {tender.tenderWinner?.name ?? "—"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge tender-status-${statusToClassName(tender.status)}`}
                      >
                        {TENDER_STATUS_LABELS[tender.status] ?? tender.status}
                      </span>
                    </td>

                    <td className="actions-column">
                      <ActionsMenu label={`Actions for ${tender.title}`}>
                        <Link
                          to={`/disposal-requests/${tender.id}`}
                          className="dropdown-item"
                        >
                          <Eye />
                          View details
                        </Link>

                        <button
                          type="button"
                          className="dropdown-item dropdown-item-destructive"
                          onClick={() => handleDelete(tender)}
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

export default Tenders;
