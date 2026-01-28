import React, { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    // console.log(res);
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await API.post("/auth/signup", { name, email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
