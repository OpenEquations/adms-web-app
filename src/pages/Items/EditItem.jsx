import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Package,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { itemsApi } from "../../lib/api/items";
import { warehousesApi } from "../../lib/api/warehouses";
import { ApiError } from "../../lib/apiClient";
import { ITEM_STATUSES, ITEM_STATUS_LABELS, ITEM_TYPES, ITEM_TYPE_LABELS } from "../../lib/constants";

import "./AddItem.css";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState([]);
  const [originalWarehouseId, setOriginalWarehouseId] = useState("");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [item, warehousesData] = await Promise.all([
          itemsApi.getById(id),
          warehousesApi.getAll(),
        ]);

        if (cancelled) {
          return;
        }

        const currentWarehouse = warehousesData.find((warehouse) =>
          warehouse.items.some((warehouseItem) => warehouseItem.id === item.id),
        );

        setWarehouses(warehousesData);
        setOriginalWarehouseId(currentWarehouse ? String(currentWarehouse.id) : "");
        setForm({
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          itemStatus: item.itemStatus,
          itemType: item.itemType ?? "",
          itemHealth: String(item.itemHealth),
          warehouseId: currentWarehouse ? String(currentWarehouse.id) : "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load item.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors([]);
    setSubmitting(true);

    try {
      await Promise.all([
        itemsApi.changeName(id, form.itemName),
        itemsApi.changeDescription(id, form.itemDescription),
        itemsApi.changeStatus(id, form.itemStatus),
        itemsApi.changeType(id, form.itemType),
        itemsApi.changeHealth(id, Number(form.itemHealth)),
      ]);

      if (form.warehouseId !== originalWarehouseId) {
        if (originalWarehouseId) {
          await warehousesApi.removeItem(originalWarehouseId, id);
        }
        if (form.warehouseId) {
          await warehousesApi.addItem(form.warehouseId, id);
        }
      }

      navigate("/items");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.details ?? []);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="add-item-page">
        <div className="state-block">
          <span className="spinner" />
          Loading item...
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="add-item-page">
        <div
          className="banner banner-error"
          role="alert"
        >
          <AlertCircle />
          <span>{error || "Item not found."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="add-item-page">
      <div className="item-page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/items">Items</Link>
            <span>/</span>
            <span>Edit Item</span>
          </div>

          <div className="item-title-row">
            <div className="item-title-icon">
              <Package />
            </div>

            <div>
              <h1>Edit Item</h1>
              <p>
                Update this asset's details or move it to another warehouse.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="add-item-layout">
        <div className="card add-item-card">
          <div className="form-card-header">
            <h2>Item information</h2>
            <p>
              Update the basic information about this asset.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div
                className="banner banner-error"
                role="alert"
              >
                <AlertCircle />
                <div>
                  <span>{error}</span>
                  {fieldErrors.length > 0 && (
                    <ul>
                      {fieldErrors.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-name">
                  Item name
                </label>

                <input
                  id="item-name"
                  type="text"
                  className="input"
                  autoComplete="off"
                  value={form.itemName}
                  onChange={updateField("itemName")}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="item-status">
                  Status
                </label>

                <select
                  id="item-status"
                  className="input"
                  value={form.itemStatus}
                  onChange={updateField("itemStatus")}
                  required
                >
                  {ITEM_STATUSES.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {ITEM_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="item-description">
                Description
              </label>

              <textarea
                id="item-description"
                className="input textarea"
                rows="4"
                value={form.itemDescription}
                onChange={updateField("itemDescription")}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-type">
                  Type
                </label>

                <select
                  id="item-type"
                  className="input"
                  value={form.itemType}
                  onChange={updateField("itemType")}
                  required
                >
                  <option
                    value=""
                    disabled
                  >
                    Select type
                  </option>
                  {ITEM_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {ITEM_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="item-health">
                  Health
                </label>

                <input
                  id="item-health"
                  type="number"
                  className="input"
                  min="0"
                  max="100"
                  value={form.itemHealth}
                  onChange={updateField("itemHealth")}
                  required
                />

                <span className="form-help">
                  Enter a health score between 0 and 100.
                </span>
              </div>
            </div>

            <div className="allocation-section">
              <div className="allocation-header">
                <div className="allocation-icon">
                  <WarehouseIcon />
                </div>

                <div>
                  <h3>Warehouse allocation</h3>
                  <p>
                    Move this item to a different warehouse, or unallocate it.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="warehouse">
                  Warehouse
                </label>

                <select
                  id="warehouse"
                  className="input"
                  value={form.warehouseId}
                  onChange={updateField("warehouseId")}
                >
                  <option value="">
                    Not allocated
                  </option>

                  {warehouses.map((warehouse) => (
                    <option
                      key={warehouse.id}
                      value={warehouse.id}
                    >
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <Link
                to="/items"
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
      </div>
    </div>
  );
}

export default EditItem;
