import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
export default function PrivateRoute({
  children,
  adminOnly = false,
  userOnly = false,
}) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (userOnly && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
