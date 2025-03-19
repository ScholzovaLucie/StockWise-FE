"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("selectedClient") || null;
    }
    return null;
  });

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

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
