"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Vytvoření kontextu pro zprávy – výchozí hodnota je undefined
const MessageContext = createContext(undefined);

// Provider, který obaluje aplikaci a poskytuje zprávu a setter
export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  // Efekt, který automaticky smaže zprávu po 4 sekundách
  useEffect(() => {
    if (message !== "") {
      // Nastavíme timeout pro vymazání zprávy
      const timeout = setTimeout(() => {
        setMessage("");
      }, 4000);

      // Pokud se zpráva změní nebo komponenta odmountuje, zrušíme timeout
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

// Custom hook pro přístup ke kontextu zpráv
export const useMessage = () => {
  const context = useContext(MessageContext);

  // Pokud hook voláme mimo MessageProvider, vyhodíme chybu
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }

  return context;
};
