"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "services/authService";
import LoadingScreen from "components/loadingScreen";

// Vytvoření kontextu pro autentizaci
const AuthContext = createContext(null);

// Provider obalující aplikaci – zajišťuje přihlášeného uživatele
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  // Funkce pro načtení uživatele z backendu
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

  // Načteme uživatele při načtení komponenty
  useEffect(() => {
    fetchUser();
  }, []);

  // Zobrazíme loading screen, dokud se neověří autentizace
  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, reloadUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pro snadné použití autentizačního kontextu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth musí být použit uvnitř AuthProvider.");
  }
  return context;
};
