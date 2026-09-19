import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Edit,
  Inbox,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { itemsApi } from "../../lib/api/items";
import { warehousesApi } from "../../lib/api/warehouses";
import { ApiError } from "../../lib/apiClient";
import { ITEM_STATUS_LABELS, ITEM_TYPE_LABELS, statusToClassName } from "../../lib/constants";
import ActionsMenu from "../../components/ActionsMenu/ActionsMenu";

import "./Items.css";

function Items() {
  const [items, setItems] = useState([]);
  const [warehouseByItemId, setWarehouseByItemId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const [itemsData, warehousesData] = await Promise.all([
        itemsApi.getAll(),
        warehousesApi.getAll(),
      ]);

      const warehouseMap = {};
      warehousesData.forEach((warehouse) => {
        warehouse.items.forEach((item) => {
          warehouseMap[item.id] = warehouse.name;
        });
      });

      setItems(itemsData);
      setWarehouseByItemId(warehouseMap);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadItems();
  }, []);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.itemName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await itemsApi.remove(item.id);
      setItems((current) => current.filter((existing) => existing.id !== item.id));
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to delete item.");
    }
  };

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return items;
    }
    return items.filter((item) => item.itemName.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <div className="items-page">
      {/* Header */}
      <div className="items-header">
        <div>
          <h1>Items</h1>
          <p>
            Manage and track your organization's assets.
          </p>
        </div>

        <Link
          to="/items/new"
          className="btn btn-primary"
        >
          <Plus />
          Add Item
        </Link>
      </div>

      {/* Items Card */}
      <div className="items-card card">
        {/* Toolbar */}
        <div className="items-toolbar">
          <div className="item-search">
            <Search className="item-search-icon" />

            <input
              type="search"
              className="input"
              placeholder="Search items..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="items-summary">
            {filteredItems.length} items
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
            Loading items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="state-block">
            <Inbox />
            {items.length === 0 ? "No items yet. Add your first item to get started." : "No items match your search."}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Health</th>
                    <th>Warehouse</th>
                    <th>Date Bought</th>
                    <th className="actions-column">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      {/* Item */}
                      <td>
                        <div className="item-name">
                          <div className="item-icon">
                            <Package />
                          </div>

                          <div>
                            <span className="item-title">
                              {item.itemName}
                            </span>

                            <span className="item-id">
                              IT-{String(item.id).padStart(4, "0")}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td>
                        <span className="item-type">
                          {ITEM_TYPE_LABELS[item.itemType] ?? "Unspecified"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge status-${statusToClassName(item.itemStatus)}`}
                        >
                          {ITEM_STATUS_LABELS[item.itemStatus] ?? item.itemStatus}
                        </span>
                      </td>

                      {/* Health */}
                      <td>
                        <div className="item-health">
                          <div className="health-bar">
                            <div
                              className="health-bar-fill"
                              style={{
                                width: `${item.itemHealth}%`,
                              }}
                            />
                          </div>

                          <span>{item.itemHealth}%</span>
                        </div>
                      </td>

                      {/* Warehouse */}
                      <td>
                        <span className="item-warehouse">
                          {warehouseByItemId[item.id] ?? "Unallocated"}
                        </span>
                      </td>

                      {/* Date */}
                      <td>
                        <span className="item-date">
                          {item.dateBought ?? "—"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="actions-column">
                        <ActionsMenu label={`Actions for ${item.itemName}`}>
                          <Link
                            to={`/items/${item.id}/edit`}
                            className="dropdown-item"
                          >
                            <Edit />
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="dropdown-item dropdown-item-destructive"
                            onClick={() => handleDelete(item)}
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

            {/* Footer */}
            <div className="items-footer">
              <span>
                {filteredItems.length} items
              </span>

              <span>
                {search ? "Showing filtered results" : "Showing all items"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Items;
