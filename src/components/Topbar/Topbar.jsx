import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";

import "./Topbar.css";

function Topbar() {
  return (
    <header className="topbar">
      {/* Page information */}
      <div className="topbar-left">
        <div>
          <h1 className="topbar-title">
            Dashboard
          </h1>

          <p className="topbar-subtitle">
            Overview of your Assets Disposal Management system
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="topbar-right">
        {/* Search */}
        <button
          className="topbar-button"
          aria-label="Search"
        >
          <Search />
        </button>

        {/* Notifications */}
        <button
          className="topbar-button notification-button"
          aria-label="Notifications"
        >
          <Bell />

          <span className="notification-dot" />
        </button>

        <div className="topbar-divider" />

        {/* User */}
        <button className="topbar-user">
          <div className="avatar avatar-sm">
            BJ
          </div>

          <div className="topbar-user-info">
            <span>
              Bonheur Joseph
            </span>

            <small>
              Administrator
            </small>
          </div>

          <ChevronDown className="topbar-chevron" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;