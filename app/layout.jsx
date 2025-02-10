"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from "@mui/material";
import { AuthProvider, useAuth } from "../hooks/useAuth";

export default function RootLayout({ children }) {
  const [mode, setMode] = useState("light"); // Výchozí hodnota
  const [isClient, setIsClient] = useState(false); // Pro kontrolu klientského vykreslení

  useEffect(() => {
    setIsClient(true);
    const storedMode = localStorage.getItem("theme");
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#673AB7" },
          secondary: { main: "#03DAC6" },
          background: {
            default: mode === "dark" ? "#121212" : "#F5F5F5",
            paper: mode === "dark" ? "#1E1E1E" : "#FFFFFF",
          },
          text: {
            primary: mode === "dark" ? "#FFFFFF" : "#212121",
            secondary: mode === "dark" ? "#B0BEC5" : "#616161",
          },
        },
        typography: { fontFamily: "'Roboto', 'Arial', sans-serif" },
      }),
    [mode]
  );

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StockWise</title>

      </head>
      <body>
      <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AuthProvider>
      </body>
    </html>
  );
}