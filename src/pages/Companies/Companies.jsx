import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  Edit,
  Inbox,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { companiesApi } from "../../lib/api/companies";
import { ApiError } from "../../lib/apiClient";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";

import "./Companies.css";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadCompanies = async () => {
    setLoading(true);
    setError("");

    try {
      setCompanies(await companiesApi.getAll());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCompanies();
  }, []);

  const handleDelete = async (company) => {
    if (!window.confirm(`Delete "${company.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await companiesApi.remove(company.id);
      setCompanies((current) => current.filter((existing) => existing.id !== company.id));
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to delete company.");
    }
  };

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return companies;
    }
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company.email.toLowerCase().includes(query),
    );
  }, [companies, search]);

  return (
    <div className="companies-page">
      <div className="companies-header">
        <div>
          <h1>Companies</h1>
          <p>
            Manage the companies involved in repairs, purchases, and tenders.
          </p>
        </div>

        <Link
          to="/companies/new"
          className="btn btn-primary"
        >
          <Plus />
          Add Company
        </Link>
      </div>

      <div className="companies-card card">
        <div className="companies-toolbar">
          <div className="company-search">
            <Search className="company-search-icon" />

            <input
              type="search"
              className="input"
              placeholder="Search companies..."
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
            Loading companies...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="state-block">
            <Inbox />
            {companies.length === 0
              ? "No companies yet. Add your first company to get started."
              : "No companies match your search."}
          </div>
        ) : (
          <div className="company-table-wrapper">
            <table className="company-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Email</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <div className="company-name">
                        <div className="company-icon">
                          <Building2 />
                        </div>

                        <span className="company-title">
                          {company.name}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="company-email">
                        {company.email}
                      </span>
                    </td>

                    <td className="actions-column">
                      <ActionsMenu label={`Actions for ${company.name}`}>
                        <Link
                          to={`/companies/${company.id}/edit`}
                          className="dropdown-item"
                        >
                          <Edit />
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="dropdown-item dropdown-item-destructive"
                          onClick={() => handleDelete(company)}
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

export default Companies;
