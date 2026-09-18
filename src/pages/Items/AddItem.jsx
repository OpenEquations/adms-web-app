import {
  ArrowLeft,
  Package,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./AddItem.css";

function AddItem() {
  const warehouses = [
    {
      id: 1,
      name: "Kigali Central Warehouse",
    },
    {
      id: 2,
      name: "Rubavu Warehouse",
    },
    {
      id: 3,
      name: "Huye Warehouse",
    },
    {
      id: 4,
      name: "Musanze Warehouse",
    },
  ];

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

          <form>
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
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="ACTIVE">Active</option>
                  <option value="IN_REPAIR">In Repair</option>
                  <option value="SOLD">Sold</option>
                  <option value="DISPOSED">Disposed</option>
                </select>
              </div>

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
                  defaultValue=""
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
              >
                Add Item
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