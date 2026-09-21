import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

import Warehouses from "./pages/Warehouses/Warehouses";
import AddWarehouse from "./pages/Warehouses/AddWarehouse";
import WarehouseDetail from "./pages/Warehouses/WarehouseDetail";

import Items from "./pages/Items/Items";
import AddItem from "./pages/Items/AddItem";
import EditItem from "./pages/Items/EditItem";
import ItemHealthHistory from "./pages/Items/ItemHealthHistory";

import Companies from "./pages/Companies/Companies";
import AddCompany from "./pages/Companies/AddCompany";
import EditCompany from "./pages/Companies/EditCompany";

import Users from "./pages/Users/Users";
import AddUser from "./pages/Users/AddUser";
import EditUser from "./pages/Users/EditUser";
import MyAccount from "./pages/Account/MyAccount";

import Tenders from "./pages/Tenders/Tenders";
import AddTender from "./pages/Tenders/AddTender";
import TenderDetail from "./pages/Tenders/TenderDetail";
import TenderPoster from "./pages/Tenders/TenderPoster";

import OrganizationSettings from "./pages/Settings/OrganizationSettings";

import Reports from "./pages/Reports/Reports";
import StockReportView from "./pages/Reports/StockReportView";

function protect(element, options = {}) {
  return (
    <ProtectedRoute {...options}>
      <DashboardLayout>{element}</DashboardLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/dashboard"
            element={protect(<Dashboard />)}
          />

          <Route
            path="/items"
            element={protect(<Items />, { permission: "MANAGE_ITEMS" })}
          />
          <Route
            path="/items/new"
            element={protect(<AddItem />, { permission: "MANAGE_ITEMS" })}
          />
          <Route
            path="/items/:id/edit"
            element={protect(<EditItem />, { permission: "MANAGE_ITEMS" })}
          />
          <Route
            path="/items/:id/health-history"
            element={protect(<ItemHealthHistory />, { permission: "MANAGE_ITEMS" })}
          />

          <Route
            path="/warehouses"
            element={protect(<Warehouses />, { permission: "MANAGE_WAREHOUSES" })}
          />
          <Route
            path="/warehouses/new"
            element={protect(<AddWarehouse />, { permission: "MANAGE_WAREHOUSES" })}
          />
          <Route
            path="/warehouses/:id"
            element={protect(<WarehouseDetail />, { permission: "MANAGE_WAREHOUSES" })}
          />

          <Route
            path="/companies"
            element={protect(<Companies />, { permission: "MANAGE_COMPANIES" })}
          />
          <Route
            path="/companies/new"
            element={protect(<AddCompany />, { permission: "MANAGE_COMPANIES" })}
          />
          <Route
            path="/companies/:id/edit"
            element={protect(<EditCompany />, { permission: "MANAGE_COMPANIES" })}
          />

          <Route
            path="/account"
            element={protect(<MyAccount />)}
          />

          <Route
            path="/users"
            element={protect(<Users />, { superAdminOnly: true })}
          />
          <Route
            path="/users/new"
            element={protect(<AddUser />, { superAdminOnly: true })}
          />
          <Route
            path="/users/:id/edit"
            element={protect(<EditUser />, { superAdminOnly: true })}
          />

          <Route
            path="/disposal-requests"
            element={protect(<Tenders />, { permission: "MANAGE_TENDERS" })}
          />
          <Route
            path="/disposal-requests/new"
            element={protect(<AddTender />, { permission: "MANAGE_TENDERS" })}
          />
          <Route
            path="/disposal-requests/:id"
            element={protect(<TenderDetail />, { permission: "MANAGE_TENDERS" })}
          />
          <Route
            path="/disposal-requests/:id/poster"
            element={
              <ProtectedRoute permission="MANAGE_TENDERS">
                <TenderPoster />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={protect(<Reports />)}
          />
          <Route
            path="/reports/:id"
            element={
              <ProtectedRoute>
                <StockReportView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={protect(<OrganizationSettings />, { superAdminOnly: true })}
          />

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
