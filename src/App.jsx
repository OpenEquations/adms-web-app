import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import Login from "./pages/Login/Login";
import Warehouses from "./pages/Warehouses/Warehouses";
import AddWarehouse from "./pages/Warehouses/AddWarehouse";
import AddItem from "./pages/Items/AddItem";
import Items from "./pages/Items/Items";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/warehouses"
          element={
            <DashboardLayout>
              <Warehouses />
            </DashboardLayout>
          }
        />
        <Route
          path="/items"
          element={
            <DashboardLayout>
              <Items />
            </DashboardLayout>
          }
        />

        <Route
          path="/warehouses/new"
          element={
            <DashboardLayout>
              <AddWarehouse />
            </DashboardLayout>
          }
        />

        <Route
          path="/items/new"
          element={
            <DashboardLayout>
              <AddItem />
            </DashboardLayout>
          }
        />

        <Route
          path="/"
          element={
            <Navigate
              to="/warehouses"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/warehouses"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;