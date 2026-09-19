import { BarChart3, Settings } from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ComingSoon from "./pages/ComingSoon/ComingSoon";

import Warehouses from "./pages/Warehouses/Warehouses";
import AddWarehouse from "./pages/Warehouses/AddWarehouse";
import WarehouseDetail from "./pages/Warehouses/WarehouseDetail";

import Items from "./pages/Items/Items";
import AddItem from "./pages/Items/AddItem";
import EditItem from "./pages/Items/EditItem";

import Companies from "./pages/Companies/Companies";
import AddCompany from "./pages/Companies/AddCompany";
import EditCompany from "./pages/Companies/EditCompany";

import Users from "./pages/Users/Users";
import AddUser from "./pages/Users/AddUser";
import EditUser from "./pages/Users/EditUser";

import Tenders from "./pages/Tenders/Tenders";
import AddTender from "./pages/Tenders/AddTender";
import TenderDetail from "./pages/Tenders/TenderDetail";

function protect(element) {
  return (
    <ProtectedRoute>
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
            element={protect(<Items />)}
          />
          <Route
            path="/items/new"
            element={protect(<AddItem />)}
          />
          <Route
            path="/items/:id/edit"
            element={protect(<EditItem />)}
          />

          <Route
            path="/warehouses"
            element={protect(<Warehouses />)}
          />
          <Route
            path="/warehouses/new"
            element={protect(<AddWarehouse />)}
          />
          <Route
            path="/warehouses/:id"
            element={protect(<WarehouseDetail />)}
          />

          <Route
            path="/companies"
            element={protect(<Companies />)}
          />
          <Route
            path="/companies/new"
            element={protect(<AddCompany />)}
          />
          <Route
            path="/companies/:id/edit"
            element={protect(<EditCompany />)}
          />

          <Route
            path="/users"
            element={protect(<Users />)}
          />
          <Route
            path="/users/new"
            element={protect(<AddUser />)}
          />
          <Route
            path="/users/:id/edit"
            element={protect(<EditUser />)}
          />

          <Route
            path="/disposal-requests"
            element={protect(<Tenders />)}
          />
          <Route
            path="/disposal-requests/new"
            element={protect(<AddTender />)}
          />
          <Route
            path="/disposal-requests/:id"
            element={protect(<TenderDetail />)}
          />

          <Route
            path="/reports"
            element={protect(
              <ComingSoon
                icon={BarChart3}
                title="Reports"
                description="Reporting and analytics are on the roadmap. Check back soon."
              />,
            )}
          />
          <Route
            path="/settings"
            element={protect(
              <ComingSoon
                icon={Settings}
                title="Settings"
                description="Workspace settings are on the roadmap. Check back soon."
              />,
            )}
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
