"use client";

import React from "react";
import { AuthProvider } from "/context/authContext";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "/theme/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="cz">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StockWise</title>
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
