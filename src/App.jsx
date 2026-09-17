import "./App.css";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import Login from "./pages/Login/Login";


function App() {
  return (
    <>
      {/* <Login /> */}

      <DashboardLayout>

      <div className="dashboard-content-inner">

        <div className="card">
          <h2>
            Welcome to ADMS
          </h2>

          <p className="muted">
            Your asset management dashboard.
          </p>
        </div>

      </div>

    </DashboardLayout>  
    </>
  );
}

export default App;