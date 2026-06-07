"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const VALID_USER = {
  email: "hola@arco.com",
  password: "12345",
  name: "Arco User",
  initials: "AU",
};

const SESSION_KEY = "valmart_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
    setReady(true);
  }, []);

  const login = (email, password) => {
    if (email === VALID_USER.email && password === VALID_USER.password) {
      const userData = {
        email: VALID_USER.email,
        name: VALID_USER.name,
        initials: VALID_USER.initials,
      };
      setUser(userData);
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      } catch (_) {}
      return { success: true };
    }
    return { success: false, error: "Credenciales incorrectas" };
  };

  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (_) {}
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, ready }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
