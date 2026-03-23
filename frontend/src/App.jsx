import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import AddVictim from "./pages/admin/AddVictim";
import DatabaseTables from "./pages/admin/DatabaseTables";
import Dashboard from "./pages/admin/Dashboard";
import Donations from "./pages/admin/Donations";
import VictimList from "./pages/admin/VictimList";
import Register from "./pages/Register";
import Donate from "./pages/user/Donate";
import Home from "./pages/user/Home";
import SearchVictim from "./pages/user/SearchVictim";
import UserDashboard from "./pages/user/UserDashboard";
import VictimDetails from "./pages/user/VictimDetails";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Navigate to="/user/login" replace />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/user"
            element={
              <ProtectedRoute role="user" redirectTo="/user/login">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/search"
            element={
              <ProtectedRoute role="user" redirectTo="/user/login">
                <SearchVictim />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/donate"
            element={
              <ProtectedRoute role="user" redirectTo="/user/login">
                <Donate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/victim/:id"
            element={
              <ProtectedRoute redirectTo="/user/login">
                <VictimDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin" redirectTo="/admin/login">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="victims" element={<VictimList />} />
            <Route path="add-victim" element={<AddVictim />} />
            <Route path="donations" element={<Donations />} />
            <Route path="database" element={<DatabaseTables />} />
          </Route>

          <Route path="/search" element={<Navigate to="/user/search" replace />} />
          <Route path="/donate" element={<Navigate to="/user/donate" replace />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
