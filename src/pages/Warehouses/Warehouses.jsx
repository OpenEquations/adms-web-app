import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Eye,
  Inbox,
  Plus,
  Search,
  Trash2,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { warehousesApi } from "../../lib/api/warehouses";
import { ApiError } from "../../lib/apiClient";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";

import "./Warehouses.css";

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadWarehouses = async () => {
    setLoading(true);
    setError("");

    try {
      setWarehouses(await warehousesApi.getAll());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load warehouses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadWarehouses();
  }, []);

  const handleDelete = async (warehouse) => {
    if (!window.confirm(`Delete "${warehouse.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await warehousesApi.remove(warehouse.id);
      setWarehouses((current) => current.filter((existing) => existing.id !== warehouse.id));
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to delete warehouse.");
    }
  };

  const filteredWarehouses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return warehouses;
    }
    return warehouses.filter((warehouse) => warehouse.name.toLowerCase().includes(query));
  }, [warehouses, search]);

  return (
    <div className="warehouses-page">
      <div className="warehouses-header">
        <div>
          <h1>Warehouses</h1>
          <p>
            Manage the locations where your organization's items
            are stored.
          </p>
        </div>

        <Link
          to="/warehouses/new"
          className="btn btn-primary"
        >
          <Plus />
          Add Warehouse
        </Link>
      </div>

      <div className="warehouses-card card">
        <div className="warehouses-toolbar">
          <div className="warehouse-search">
            <Search className="warehouse-search-icon" />

            <input
              type="search"
              className="input"
              placeholder="Search warehouses..."
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
            Loading warehouses...
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="state-block">
            <Inbox />
            {warehouses.length === 0
              ? "No warehouses yet. Add your first warehouse to get started."
              : "No warehouses match your search."}
          </div>
        ) : (
          <>
            <div className="warehouse-table-wrapper">
              <table className="warehouse-table">
                <thead>
                  <tr>
                    <th>Warehouse</th>
                    <th>Items</th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredWarehouses.map((warehouse) => (
                    <tr key={warehouse.id}>
                      <td>
                        <Link
                          to={`/warehouses/${warehouse.id}`}
                          className="warehouse-name"
                        >
                          <div className="warehouse-icon">
                            <WarehouseIcon />
                          </div>

                          <div>
                            <span className="warehouse-title">
                              {warehouse.name}
                            </span>

                            <span className="warehouse-id">
                              WH-{String(warehouse.id).padStart(4, "0")}
                            </span>
                          </div>
                        </Link>
                      </td>

                      <td>
                        <span className="item-count">
                          {warehouse.items.length}
                        </span>
                      </td>

                      <td className="actions-column">
                        <ActionsMenu label={`Actions for ${warehouse.name}`}>
                          <Link
                            to={`/warehouses/${warehouse.id}`}
                            className="dropdown-item"
                          >
                            <Eye />
                            View items
                          </Link>

                          <button
                            type="button"
                            className="dropdown-item dropdown-item-destructive"
                            onClick={() => handleDelete(warehouse)}
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

            <div className="warehouses-footer">
              <span>
                {filteredWarehouses.length} warehouses
              </span>

              <span>
                {search ? "Showing filtered results" : "Showing all warehouses"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Warehouses;
