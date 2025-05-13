"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "services/authService";
import LoadingScreen from "components/loadingScreen";

// Vytvoření kontextu pro autentizaci
const AuthContext = createContext(null);

// Provider obalující aplikaci – zajišťuje přihlášeného uživatele
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // přihlášený uživatel
  const [initialLoading, setInitialLoading] = useState(true); // načítání při prvním mountu
  const router = useRouter();

  // Funkce pro načtení uživatele z backendu
  const fetchUser = async () => {
    try {
      const response = await fetchCurrentUser(); // volá /auth/me/
      setUser(response);
    } catch (error) {
      setUser(null); // chyba při načítání → nastavíme null
      router.push("/auth/login"); // přesměrování na login
    } finally {
      setInitialLoading(false); // ukončíme stav načítání
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
