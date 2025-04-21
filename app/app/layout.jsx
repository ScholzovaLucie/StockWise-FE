"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Snackbar } from "@mui/material";
import { lightTheme, darkTheme } from "/theme/theme";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import UserSection from "/components/UserSection";
import { usePathname, useRouter } from "next/navigation";
import { ClientProvider } from "/context/clientContext"; // Import ClientProvider
import { MessageProvider, useMessage } from "/context/messageContext";
import ClientSelector from "/components/clientSelector";
import LayoutWrapper from "./LayoutWrapper";
import RouteTracker from "/context/routerTracker";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  DashboardRounded as DashboardIcon,
  Inventory2Rounded as InventoryIcon,
  PersonSearchRounded as PersonIcon,
  BatchPredictionRounded as BatchIcon,
  LocalGroceryStore as StoreIcon,
  Place as PlaceIcon,
  Workspaces as WorkspacesIcon,
  Warehouse as WarehouseIcon,
  Loop as LoopIcon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";

const NAVIGATION = [
  {
    segment: "app/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon color="primary" />,
  },
  {
    segment: "app/chatbot",
    title: "Chat",
    icon: <SmartToyIcon color="primary" />,
  },
  {
    segment: "app/statistic",
    title: "Statistiky",
    icon: <QueryStatsIcon color="primary" />,
  },
  {
    segment: "app/clients",
    title: "Klienti",
    icon: <PersonIcon color="primary" />,
  },
  { kind: "divider" },
  {
    segment: "app/products",
    title: "Položka",
    icon: <StoreIcon color="primary" />,
  },
  {
    segment: "app/batches",
    title: "Šarže",
    icon: <BatchIcon color="primary" />,
  },
  { kind: "divider" },
  {
    segment: "app/boxes",
    title: "Krabice",
    icon: <InventoryIcon color="primary" />,
  },
  {
    segment: "app/groups",
    title: "Skupina",
    icon: <WorkspacesIcon color="primary" />,
  },
  {
    segment: "app/operations",
    title: "Operace",
    icon: <LoopIcon color="primary" />,
  },
  { kind: "divider" },
  {
    segment: "app/positions",
    title: "Pozice",
    icon: <PlaceIcon color="primary" />,
  },
  {
    segment: "app/warehouse",
    title: "Sklad",
    icon: <WarehouseIcon color="primary" />,
  },
  { kind: "divider" },
  {
    segment: "app/history",
    title: "Historie",
    icon: <RestoreIcon color="primary" />,
  },
];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // 🛠 Inicializace módu z sessionStorage
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("themeMode") || "light";
    }
    return "light";
  });

  // 🛠 Uložení módu do sessionStorage při změně
  useEffect(() => {
    sessionStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouteTracker />
      <ClientProvider>
        <MessageProvider>
          <AppProvider
            navigation={NAVIGATION}
            branding={{ title: "StockWise" }}
            theme={theme}
            router={{ pathname, navigate: (path) => router.push(path) }}
          >
            <DashboardLayout
              sidebarExpandedWidth={220}
              slots={{
                toolbarActions: () => (
                  <>
                    <ClientSelector />
                    <UserSection mode={mode} setMode={setMode} />
                  </>
                ),
              }}
            >
              <LayoutWrapper>{children}</LayoutWrapper>
              <MessageSnackbar />
            </DashboardLayout>
          </AppProvider>
        </MessageProvider>
      </ClientProvider>
    </ThemeProvider>
  );
}

function MessageSnackbar() {
  const { message, setMessage } = useMessage();

  return (
    <Snackbar
      open={!!message}
      onClose={() => setMessage(null)}
      message={message}
      autoHideDuration={3000}
    />
  );
}
