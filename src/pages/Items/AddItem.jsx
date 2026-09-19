import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Package,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { itemsApi } from "../../lib/api/items";
import { warehousesApi } from "../../lib/api/warehouses";
import { ApiError } from "../../lib/apiClient";
import { ITEM_STATUSES, ITEM_STATUS_LABELS, ITEM_TYPES, ITEM_TYPE_LABELS } from "../../lib/constants";

import "./AddItem.css";

const emptyForm = {
  itemName: "",
  itemDescription: "",
  itemStatus: "",
  itemType: "",
  itemHealth: "",
  dateBought: "",
  warehouseId: "",
};

function AddItem() {
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    warehousesApi
      .getAll()
      .then(setWarehouses)
      .catch(() => setWarehouses([]));
  }, []);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors([]);
    setSubmitting(true);

    try {
      const created = await itemsApi.create({
        itemName: form.itemName,
        itemDescription: form.itemDescription,
        itemStatus: form.itemStatus || null,
        itemType: form.itemType || null,
        itemHealth: form.itemHealth === "" ? null : Number(form.itemHealth),
        dateBought: form.dateBought || null,
      });

      if (form.warehouseId) {
        await warehousesApi.addItem(form.warehouseId, created.id);
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

  return (
    <div className="add-item-page">
      <div className="item-page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/items">Items</Link>
            <span>/</span>
            <span>Add Item</span>
          </div>

          <div className="item-title-row">
            <div className="item-title-icon">
              <Package />
            </div>

            <div>
              <h1>Add Item</h1>
              <p>
                Register a new asset and optionally allocate it
                to a warehouse.
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
              Enter the basic information about this asset.
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
                  name="itemName"
                  type="text"
                  className="input"
                  placeholder="e.g. Dell Latitude 5420"
                  autoComplete="off"
                  value={form.itemName}
                  onChange={updateField("itemName")}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date-bought">
                  Date bought
                </label>

                <input
                  id="date-bought"
                  name="dateBought"
                  type="date"
                  className="input"
                  value={form.dateBought}
                  onChange={updateField("dateBought")}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="item-description">
                Description
              </label>

              <textarea
                id="item-description"
                name="itemDescription"
                className="input textarea"
                placeholder="Describe the item..."
                rows="4"
                value={form.itemDescription}
                onChange={updateField("itemDescription")}
                required
              />

              <span className="form-help">
                Include useful details such as model, specifications,
                serial number, or other identifying information.
              </span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-status">
                  Status
                </label>

                <select
                  id="item-status"
                  name="itemStatus"
                  className="input"
                  value={form.itemStatus}
                  onChange={updateField("itemStatus")}
                  required
                >
                  <option
                    value=""
                    disabled
                  >
                    Select status
                  </option>
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

              <div className="form-group">
                <label htmlFor="item-type">
                  Type
                </label>

                <select
                  id="item-type"
                  name="itemType"
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-health">
                  Health
                </label>

                <input
                  id="item-health"
                  name="itemHealth"
                  type="number"
                  className="input"
                  placeholder="0 - 100"
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
                    Choose where this item is currently stored.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="warehouse">
                  Warehouse
                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <select
                  id="warehouse"
                  name="warehouseId"
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

                <span className="form-help">
                  You can allocate this item to a warehouse now
                  or leave it unallocated.
                </span>
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
                {submitting ? "Adding..." : "Add Item"}
              </button>
            </div>
          </form>
        </div>

        <div className="card item-info-card">
          <div className="info-icon">
            <Package />
          </div>

          <h3>About items</h3>

          <p>
            Items represent assets managed by your organization.
            Their status and health can change throughout their
            lifecycle.
          </p>

          <div className="info-divider" />

          <div className="info-item">
            <span>Warehouse</span>
            <strong>Optional</strong>
          </div>

          <div className="info-item">
            <span>Health</span>
            <strong>0 – 100</strong>
          </div>

          <div className="info-item">
            <span>Lifecycle</span>
            <strong>Tracked</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
