"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider } from "@/hooks/useAuth"; // Přidáme vlastní AuthProvider

export default function RootLayout({ children }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [mode, setMode] = React.useState(() => {
    return typeof window !== "undefined" && localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });
  
  const theme = React.useMemo(
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

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newMode);
    }
  };

  // Podmínka pro rozdělení layoutů
  const isDashboardPage = /^\/(dashboard|products)/.test(pathname);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StockWise</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
        <AuthProvider>
            <CssBaseline />
            {isDashboardPage ? (
              <AppProvider
                navigation={NAVIGATION}
                branding={{ title: "StockWise" }}
                router={{ pathname, navigate: (path) => router.push(path) }}
              >
                <DashboardLayout sidebarExpandedWidth={220}>
                  <IconButton onClick={toggleTheme} sx={{ position: "absolute", top: 10, right: 10 }}>
                    {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                  {children}
                </DashboardLayout>
              </AppProvider>
            ) : (
              children
            )}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}