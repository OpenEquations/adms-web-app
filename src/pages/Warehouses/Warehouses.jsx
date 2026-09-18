import {
  MoreHorizontal,
  Plus,
  Search,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./Warehouses.css";

function Warehouses() {
  const warehouses = [
    {
      id: 1,
      name: "Kigali Central Warehouse",
      items: 128,
    },
    {
      id: 2,
      name: "Rubavu Warehouse",
      items: 64,
    },
    {
      id: 3,
      name: "Huye Warehouse",
      items: 42,
    },
    {
      id: 4,
      name: "Musanze Warehouse",
      items: 31,
    },
  ];

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
            />
          </div>
        </div>

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
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>
                    <div className="warehouse-name">
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
                    </div>
                  </td>

                  <td>
                    <span className="item-count">
                      {warehouse.items}
                    </span>
                  </td>

                  <td className="actions-column">
                    <button
                      className="warehouse-action"
                      aria-label={`Actions for ${warehouse.name}`}
                    >
                      <MoreHorizontal />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="warehouses-footer">
          <span>
            {warehouses.length} warehouses
          </span>

          <span>
            Showing all warehouses
          </span>
        </div>
      </div>
    </div>
  );
}

export default Warehouses;