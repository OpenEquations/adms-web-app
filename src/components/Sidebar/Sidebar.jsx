import {
  BarChart3,
  Building2,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Warehouse as WarehouseIcon,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {
  const navItemClass = ({ isActive }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">A</div>

        <div className="brand-info">
          <span className="brand-name">ADMS</span>

          <span className="brand-description">
            Disposal Management
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Overview */}
        <div className="nav-section">
          <span className="nav-section-title">
            Overview
          </span>

          <NavLink
            to="/"
            end
            className={navItemClass}
          >
            <LayoutDashboard className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
        </div>

        {/* Management */}
        <div className="nav-section">
          <span className="nav-section-title">
            Management
          </span>

          <NavLink
            to="/items"
            className={navItemClass}
          >
            <Package className="nav-icon" />
            <span>Items</span>
          </NavLink>

          <NavLink
            to="/warehouses"
            className={navItemClass}
          >
            <WarehouseIcon className="nav-icon" />
            <span>Warehouses</span>
          </NavLink>

          <NavLink
            to="/companies"
            className={navItemClass}
          >
            <Building2 className="nav-icon" />
            <span>Companies</span>
          </NavLink>

          <NavLink
            to="/disposal-requests"
            className={navItemClass}
          >
            <ClipboardList className="nav-icon" />
            <span>Disposal Requests</span>
          </NavLink>

          <NavLink
            to="/users"
            className={navItemClass}
          >
            <Users className="nav-icon" />
            <span>Users</span>
          </NavLink>
        </div>

        {/* System */}
        <div className="nav-section">
          <span className="nav-section-title">
            System
          </span>

          <NavLink
            to="/reports"
            className={navItemClass}
          >
            <BarChart3 className="nav-icon" />
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={navItemClass}
          >
            <Settings className="nav-icon" />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-user"
        >
          <div className="avatar avatar-sm">
            BJ
          </div>

          <div className="sidebar-user-info">
            <span className="sidebar-user-name">
              Bonheur Joseph
            </span>

            <span className="sidebar-user-role">
              Administrator
            </span>
          </div>

          <ChevronDown className="user-more" />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;