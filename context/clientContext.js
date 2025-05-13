"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Kontext pro správu aktuálně vybraného klienta
const ClientContext = createContext();

// Provider, který zpřístupňuje stav vybraného klienta napříč aplikací
export const ClientProvider = ({ children }) => {
  // Inicializace klienta ze sessionStorage (při prvním načtení)
  const [selectedClient, setSelectedClient] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("selectedClient") || null;
    }
    return null;
  });

  // Uložení vybraného klienta do sessionStorage při každé změně
  useEffect(() => {
    if (selectedClient !== null) {
      sessionStorage.setItem("selectedClient", selectedClient);
    }
  }, [selectedClient]);

  return (
    <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </ClientContext.Provider>
  );
};

// Vlastní hook pro přístup ke klientovi
export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
