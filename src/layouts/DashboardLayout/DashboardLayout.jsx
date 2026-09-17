import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";

import "./DashboardLayout.css";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">

      <Sidebar />

      <Topbar />

      <main className="dashboard-content">
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;