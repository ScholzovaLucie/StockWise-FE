"use client"; // Důležité pro správnou funkčnost v Next.js

import React, { useState, useMemo } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Snackbar } from "@mui/material";
import { lightTheme, darkTheme } from "/theme/theme";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import UserSection from "/components/UserSection";
import { usePathname, useRouter } from "next/navigation";
import { ClientProvider } from "/context/clientContext"; // Import ClientProvider
import { MessageProvider, useMessage } from "/context/messageContext"; 
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import ClientSelector from "/components/clientSelector";
import BatchPredictionRoundedIcon from "@mui/icons-material/BatchPredictionRounded";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PlaceIcon from "@mui/icons-material/Place";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LoopIcon from "@mui/icons-material/Loop";
import LayoutWrapper from "./LayoutWrapper";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const NAVIGATION = [
  { segment: "app/dashboard", title: "Dashboard", icon: <DashboardRoundedIcon color="primary" /> },
  { segment: "app/chatbot", title: "Chat", icon: <SmartToyIcon color="primary" /> },
  { segment: "app/clients", title: "Klienti", icon: <PersonSearchRoundedIcon color="primary" /> },
  { kind: "divider" },
  { segment: "app/products", title: "Položka", icon: <LocalGroceryStoreIcon color="primary" /> },
  { segment: "app/batches", title: "Šarže", icon: <BatchPredictionRoundedIcon color="primary" /> },
  { kind: "divider" },
  { segment: "app/boxes", title: "Krabice", icon: <Inventory2RoundedIcon color="primary" /> },
  { segment: "app/groups", title: "Skupina", icon: <WorkspacesIcon color="primary" /> },
  { segment: "app/operations", title: "Operace", icon: <LoopIcon color="primary" /> },
  { kind: "divider" },
  { segment: "app/positions", title: "Pozice", icon: <PlaceIcon color="primary" /> },
  { segment: "app/warehouse", title: "Sklad", icon: <WarehouseIcon color="primary" /> },
];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                    <ClientSelector /> {/* Přidáme výběr klienta */}
                    <UserSection mode={mode} setMode={setMode} />
                  </>
                ),
              }}
            >
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
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