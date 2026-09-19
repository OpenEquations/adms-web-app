import { useState } from "react";
import {
  BarChart3,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
  Warehouse as WarehouseIcon,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";

function initials(user) {
  if (!user) {
    return "?";
  }

  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
}

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItemClass = ({ isActive }) =>
    isActive ? "nav-item active" : "nav-item";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
            to="/dashboard"
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
        <div className="dropdown sidebar-user-dropdown">
          <button
            type="button"
            className="sidebar-user"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <div className="avatar avatar-sm">
              {initials(user)}
            </div>

            <div className="sidebar-user-info">
              <span className="sidebar-user-name">
                {user ? `${user.firstName} ${user.lastName}` : "Guest"}
              </span>

              <span className="sidebar-user-role">
                {user?.email ?? ""}
              </span>
            </div>
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="dropdown-backdrop"
                aria-hidden="true"
                tabIndex={-1}
                onClick={() => setMenuOpen(false)}
              />

              <div className="dropdown-menu sidebar-user-menu">
                <button
                  type="button"
                  className="dropdown-item dropdown-item-destructive"
                  onClick={handleLogout}
                >
                  <LogOut />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
