"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "services/authService";
import LoadingScreen from "components/loadingScreen";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await fetchCurrentUser();
      setUser(response);
    } catch (error) {
      setUser(null);
      router.push("/auth/login");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, reloadUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth musí být použit uvnitř AuthProvider.");
  }
  return context;
};
