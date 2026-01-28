import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";
function RoleRedirect() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}
function App() {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-h-screen flex bg-gray-50">
      {user && <Sidebar />}
      <main className="flex-1 p-4 md:p-6">
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute userOnly>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute userOnly>
                <Posts />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute userOnly>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="text-center mt-20 text-gray-500">
                Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}
export default App;
