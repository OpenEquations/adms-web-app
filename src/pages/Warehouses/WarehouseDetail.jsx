import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Inbox,
  Package,
  Plus,
  Trash2,
  Warehouse as WarehouseIcon,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { warehousesApi } from "../../lib/api/warehouses";
import { itemsApi } from "../../lib/api/items";
import { ApiError } from "../../lib/apiClient";
import { ITEM_STATUS_LABELS, statusToClassName } from "../../lib/constants";

import "./WarehouseDetail.css";

function WarehouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nameDraft, setNameDraft] = useState("");
  const [renaming, setRenaming] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [warehouseData, itemsData] = await Promise.all([
        warehousesApi.getById(id),
        itemsApi.getAll(),
      ]);

      setWarehouse(warehouseData);
      setAllItems(itemsData);
      setNameDraft(warehouseData.name);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load warehouse.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const unallocatedItems = useMemo(() => {
    if (!warehouse) {
      return [];
    }
    const allocatedIds = new Set(warehouse.items.map((item) => item.id));
    return allItems.filter((item) => !allocatedIds.has(item.id));
  }, [allItems, warehouse]);

  const handleRename = async (event) => {
    event.preventDefault();
    if (!warehouse || nameDraft.trim() === warehouse.name) {
      return;
    }

    setRenaming(true);
    setError("");

    try {
      await warehousesApi.changeName(id, nameDraft);
      setWarehouse((current) => ({ ...current, name: nameDraft }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to rename warehouse.");
    } finally {
      setRenaming(false);
    }
  };

  const handleAddItem = async (event) => {
    event.preventDefault();
    if (!selectedItemId) {
      return;
    }

    setAdding(true);
    setError("");

    try {
      await warehousesApi.addItem(id, selectedItemId);
      setSelectedItemId("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add item.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveItem = async (item) => {
    if (!window.confirm(`Remove "${item.itemName}" from this warehouse?`)) {
      return;
    }

    try {
      await warehousesApi.removeItem(id, item.id);
      setWarehouse((current) => ({
        ...current,
        items: current.items.filter((existing) => existing.id !== item.id),
      }));
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to remove item.");
    }
  };

  const handleDeleteWarehouse = async () => {
    if (!warehouse) {
      return;
    }
    if (!window.confirm(`Delete "${warehouse.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await warehousesApi.remove(id);
      navigate("/warehouses");
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Failed to delete warehouse.");
    }
  };

  if (loading) {
    return (
      <div className="warehouse-detail-page">
        <div className="state-block">
          <span className="spinner" />
          Loading warehouse...
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="warehouse-detail-page">
        <div
          className="banner banner-error"
          role="alert"
        >
          <AlertCircle />
          <span>{error || "Warehouse not found."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="warehouse-detail-page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/warehouses">Warehouses</Link>
            <span>/</span>
            <span>{warehouse.name}</span>
          </div>

          <div className="page-title-row">
            <div className="page-title-icon">
              <WarehouseIcon />
            </div>

            <div>
              <h1>{warehouse.name}</h1>
              <p>{warehouse.items.length} items allocated</p>
            </div>
          </div>
        </div>

        <Link
          to="/warehouses"
          className="btn btn-outline"
        >
          <ArrowLeft />
          Back to warehouses
        </Link>
      </div>

      {error && (
        <div
          className="banner banner-error"
          role="alert"
        >
          <AlertCircle />
          <span>{error}</span>
        </div>
      )}

      <div className="warehouse-detail-layout">
        <div className="card">
          <div className="form-card-header">
            <h2>Allocated items</h2>
            <p>Items currently stored in this warehouse.</p>
          </div>

          {warehouse.items.length === 0 ? (
            <div className="state-block">
              <Inbox />
              No items allocated yet.
            </div>
          ) : (
            <div className="warehouse-detail-items">
              {warehouse.items.map((item) => (
                <div
                  key={item.id}
                  className="warehouse-detail-item"
                >
                  <div className="item-icon">
                    <Package />
                  </div>

                  <div className="warehouse-detail-item-info">
                    <span className="item-title">{item.itemName}</span>
                    <span
                      className={`badge status-${statusToClassName(item.itemStatus)}`}
                    >
                      {ITEM_STATUS_LABELS[item.itemStatus] ?? item.itemStatus}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="icon-action-button"
                    aria-label={`Remove ${item.itemName} from warehouse`}
                    onClick={() => handleRemoveItem(item)}
                  >
                    <X />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form
            className="warehouse-detail-add-form"
            onSubmit={handleAddItem}
          >
            <select
              className="input"
              value={selectedItemId}
              onChange={(event) => setSelectedItemId(event.target.value)}
            >
              <option value="">
                {unallocatedItems.length === 0 ? "No unallocated items" : "Select an item to add..."}
              </option>

              {unallocatedItems.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.itemName}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="btn btn-outline"
              disabled={!selectedItemId || adding}
            >
              <Plus />
              {adding ? "Adding..." : "Add"}
            </button>
          </form>
        </div>

        <div className="warehouse-detail-side">
          <div className="card">
            <div className="form-card-header">
              <h2>Rename warehouse</h2>
            </div>

            <form onSubmit={handleRename}>
              <div className="form-group">
                <input
                  className="input"
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline"
                disabled={renaming || nameDraft.trim() === warehouse.name}
              >
                {renaming ? "Saving..." : "Save name"}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="form-card-header">
              <h2>Danger zone</h2>
              <p>Deleting a warehouse does not delete its items.</p>
            </div>

            <button
              type="button"
              className="btn btn-outline dropdown-item-destructive"
              onClick={handleDeleteWarehouse}
            >
              <Trash2 />
              Delete warehouse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarehouseDetail;
