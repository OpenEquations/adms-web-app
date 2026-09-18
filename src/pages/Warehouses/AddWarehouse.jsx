import { ArrowLeft, Warehouse as WarehouseIcon } from "lucide-react";
import { Link } from "react-router-dom";

import "./AddWarehouse.css";

function AddWarehouse() {
  return (
    <div className="add-warehouse-page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <Link to="/warehouses">Warehouses</Link>
            <span>/</span>
            <span>Add Warehouse</span>
          </div>

          <div className="page-title-row">
            <div className="page-title-icon">
              <WarehouseIcon />
            </div>

            <div>
              <h1>Add Warehouse</h1>
              <p>
                Create a new warehouse for managing and storing your assets.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="warehouse-form-layout">
        <div className="card warehouse-form-card">
          <div className="form-card-header">
            <h2>Warehouse information</h2>
            <p>
              Enter the basic information for this warehouse.
            </p>
          </div>

          <form>
            <div className="form-group">
              <label htmlFor="warehouse-name">
                Warehouse name
              </label>

              <input
                id="warehouse-name"
                name="name"
                type="text"
                className="input"
                placeholder="e.g. Kigali Central Warehouse"
                autoComplete="off"
              />

              <span className="form-help">
                Use a clear and recognizable name for the warehouse.
              </span>
            </div>

            <div className="form-actions">
              <Link
                to="/warehouses"
                className="btn btn-outline"
              >
                <ArrowLeft />
                Cancel
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
              >
                Create Warehouse
              </button>
            </div>
          </form>
        </div>

        <div className="card warehouse-info-card">
          <div className="info-icon">
            <WarehouseIcon />
          </div>

          <div>
            <h3>About warehouses</h3>
            <p>
              A warehouse represents a physical or logical location
              where items are stored and managed.
            </p>
          </div>

          <div className="info-divider" />

          <div className="info-item">
            <span className="info-label">Items</span>
            <span className="info-value">
              Added after creation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddWarehouse;