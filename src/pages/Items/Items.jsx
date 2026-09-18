import {
  MoreHorizontal,
  Package,
  Plus,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./Items.css";

function Items() {
  const items = [
    {
      id: 1,
      name: "Dell Latitude 5420",
      status: "ACTIVE",
      health: 92,
      warehouse: "Kigali Central Warehouse",
      dateBought: "2024-03-12",
    },
    {
      id: 2,
      name: "HP ProDesk 600 G5",
      status: "IN_REPAIR",
      health: 58,
      warehouse: "Rubavu Warehouse",
      dateBought: "2023-08-21",
    },
    {
      id: 3,
      name: "Cisco Catalyst 2960",
      status: "ACTIVE",
      health: 84,
      warehouse: "Kigali Central Warehouse",
      dateBought: "2022-11-04",
    },
    {
      id: 4,
      name: "Epson Projector EB-X06",
      status: "DISPOSED",
      health: 22,
      warehouse: "Huye Warehouse",
      dateBought: "2021-06-17",
    },
  ];

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
            />
          </div>

          <div className="items-summary">
            {items.length} items
          </div>
        </div>

        {/* Table */}
        <div className="items-table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
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
              {items.map((item) => (
                <tr key={item.id}>
                  {/* Item */}
                  <td>
                    <div className="item-name">
                      <div className="item-icon">
                        <Package />
                      </div>

                      <div>
                        <span className="item-title">
                          {item.name}
                        </span>

                        <span className="item-id">
                          IT-{String(item.id).padStart(4, "0")}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`item-status status-${item.status.toLowerCase()}`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>

                  {/* Health */}
                  <td>
                    <div className="item-health">
                      <div className="health-bar">
                        <div
                          className="health-bar-fill"
                          style={{
                            width: `${item.health}%`,
                          }}
                        />
                      </div>

                      <span>{item.health}%</span>
                    </div>
                  </td>

                  {/* Warehouse */}
                  <td>
                    <span className="item-warehouse">
                      {item.warehouse}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <span className="item-date">
                      {item.dateBought}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="actions-column">
                    <button
                      type="button"
                      className="item-action"
                      aria-label={`Actions for ${item.name}`}
                    >
                      <MoreHorizontal />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="items-footer">
          <span>
            {items.length} items
          </span>

          <span>
            Showing all items
          </span>
        </div>
      </div>
    </div>
  );
}

export default Items;
