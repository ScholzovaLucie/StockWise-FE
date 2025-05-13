"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Kontext pro zobrazování dočasných zpráv (např. chyb nebo potvrzení)
const MessageContext = createContext();

// Poskytovatel zpráv, který obaluje aplikaci a spravuje stav zprávy
export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  // Automatické odstranění zprávy po 4 sekundách
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer); // Vyčištění při změně nebo unmountu
    }
  }, [message]);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

// Hook pro přístup ke zprávě a její nastavení
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
