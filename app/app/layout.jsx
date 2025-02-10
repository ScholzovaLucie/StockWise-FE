"use client";

import React, { useEffect } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useAuth } from "/hooks/useAuth";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

const NAVIGATION = [
  { segment: "app/dashboard", title: "Dashboard", icon: <DashboardRoundedIcon /> },
  { kind: "divider" },
  { segment: "app/products", title: "Items", icon: <Inventory2RoundedIcon /> },
];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ title: "StockWise" }}
      router={{ pathname, navigate: (path) => router.push(path) }}
    >
      <DashboardLayout sidebarExpandedWidth={220}>{children}</DashboardLayout>
    </AppProvider>
  );
}