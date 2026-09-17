import {
  BarChart3,
  Building2,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          A
        </div>

        <div className="brand-info">
          <span className="brand-name">ADMS</span>

          <span className="brand-description">
            Asset Management
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">
            Overview
          </span>

          <a href="#" className="nav-item active">
            <LayoutDashboard className="nav-icon" />

            <span>Dashboard</span>
          </a>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">
            Management
          </span>

          <a href="#" className="nav-item">
            <Package className="nav-icon" />

            <span>Assets</span>
          </a>

          <a href="#" className="nav-item">
            <Building2 className="nav-icon" />

            <span>Companies</span>
          </a>

          <a href="#" className="nav-item">
            <ClipboardList className="nav-icon" />

            <span>Disposal Requests</span>
          </a>

          <a href="#" className="nav-item">
            <Users className="nav-icon" />

            <span>Users</span>
          </a>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">
            System
          </span>

          <a href="#" className="nav-item">
            <BarChart3 className="nav-icon" />

            <span>Reports</span>
          </a>

          <a href="#" className="nav-item">
            <Settings className="nav-icon" />

            <span>Settings</span>
          </a>
        </div>
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <button className="sidebar-user">
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