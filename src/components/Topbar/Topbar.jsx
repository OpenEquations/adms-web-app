import {
  Bell,
  Search,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Topbar.css";

const PAGE_INFO = [
  { match: /^\/dashboard/, title: "Dashboard", subtitle: "Overview of your Assets Disposal Management system" },
  { match: /^\/items\/new/, title: "Add Item", subtitle: "Register a new asset" },
  { match: /^\/items\/.+\/edit/, title: "Edit Item", subtitle: "Update this asset's details" },
  { match: /^\/items/, title: "Items", subtitle: "Manage and track your organization's assets" },
  { match: /^\/warehouses\/new/, title: "Add Warehouse", subtitle: "Create a new storage location" },
  { match: /^\/warehouses\/.+/, title: "Warehouse", subtitle: "Warehouse details and allocated items" },
  { match: /^\/warehouses/, title: "Warehouses", subtitle: "Manage where your organization's items are stored" },
  { match: /^\/companies\/new/, title: "Add Company", subtitle: "Register a disposal or buying company" },
  { match: /^\/companies\/.+\/edit/, title: "Edit Company", subtitle: "Update company details" },
  { match: /^\/companies/, title: "Companies", subtitle: "Manage companies involved in disposal and tenders" },
  { match: /^\/users\/new/, title: "Add User", subtitle: "Create a new system user" },
  { match: /^\/users\/.+\/edit/, title: "Edit User", subtitle: "Update user details" },
  { match: /^\/users/, title: "Users", subtitle: "Manage who has access to the system" },
  { match: /^\/disposal-requests\/new/, title: "New Disposal Request", subtitle: "Create a repair or selling tender" },
  { match: /^\/disposal-requests\/.+/, title: "Disposal Request", subtitle: "Tender details, items and winner" },
  { match: /^\/disposal-requests/, title: "Disposal Requests", subtitle: "Manage repair and selling tenders" },
  { match: /^\/reports/, title: "Reports", subtitle: "Reporting and analytics" },
  { match: /^\/settings/, title: "Settings", subtitle: "Workspace settings" },
];

function resolvePageInfo(pathname) {
  const match = PAGE_INFO.find((entry) => entry.match.test(pathname));
  return match ?? { title: "ADMS", subtitle: "" };
}

function initials(user) {
  if (!user) {
    return "?";
  }

  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
}

function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const { title, subtitle } = resolvePageInfo(location.pathname);

  return (
    <header className="topbar">
      {/* Page information */}
      <div className="topbar-left">
        <div>
          <h1 className="topbar-title">
            {title}
          </h1>

          <p className="topbar-subtitle">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="topbar-right">
        {/* Search */}
        <button
          className="topbar-button"
          aria-label="Search"
          type="button"
        >
          <Search />
        </button>

        {/* Notifications */}
        <button
          className="topbar-button notification-button"
          aria-label="Notifications"
          type="button"
        >
          <Bell />
        </button>

        <div className="topbar-divider" />

        {/* User */}
        <div className="topbar-user">
          <div className="avatar avatar-sm">
            {initials(user)}
          </div>

          <div className="topbar-user-info">
            <span>
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </span>

            <small>
              {user?.email ?? ""}
            </small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
