"use client";

import React from "react";
import { getDashboardOverview } from "services/dashboardService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useClient } from "context/clientContext";
import { useTheme } from "@mui/material";

const OverviewWidget = () => {
  // Lokální stav pro přehledové statistiky
  const [overview, setOverview] = useState(null);

  // Router pro navigaci
  const router = useRouter();

  // Aktuálně vybraný klient z kontextu
  const { selectedClient } = useClient();

  // Přístup k tématu (např. pro barvy)
  const theme = useTheme();

  // Načtení dat při změně klienta
  useEffect(() => {
    getDashboardOverview({ clientId: selectedClient })
      .then((data) => setOverview(data)) // Uložení načtených dat
      .catch((err) => console.error(err)); // Chybové hlášení
  }, [selectedClient]);

  // Zobrazit text při čekání na data
  if (!overview) {
    return <Typography>Načítám data...</Typography>;
  }

  // Definice jednotlivých statistik (widgetů)
  const items = [
    {
      icon: <InventoryIcon color="primary" />,
      label: "Celkový počet produktů",
      value: overview.totalProducts,
    },
    {
      icon: <WarehouseIcon color="secondary" />,
      label: "Celkový počet kusů",
      value: overview.totalItems,
    },
    {
      icon: <WarningAmberIcon sx={{ color: "orange" }} />,
      label: "Produkty s blížící se expirací",
      value: overview.expiringSoonCount.count,
      link: `/app/batches?search=${overview.expiringSoonCount.data}`, // odkaz na detaily
    },
    {
      icon: <ArrowDownwardIcon sx={{ color: "red" }} />,
      label: "Produkty s nízkou zásobou",
      value: overview.lowStockCount.count,
      link: `/app/products?search=${overview.lowStockCount.data}`,
    },
    {
      icon: <RemoveShoppingCartIcon sx={{ color: "red" }} />,
      label: "Nezaskladněné produkty",
      value: overview.outOfStockProducts.count,
      link: `/app/products?search=${overview.outOfStockProducts.data}`,
    },
    {
      icon: <ArrowUpwardIcon sx={{ color: "green" }} />,
      label: "Nejzásobenější produkt",
      value: `${overview.mostStockedProduct?.name || 0} (${
        overview.mostStockedProduct?.amount || 0
      })`,
      link: `/app/products?search=${overview.mostStockedProduct?.name}`,
    },
  ];

  return (
    <Box
      sx={{
        overflow: "auto", // posuvník při přetečení obsahu
        height: "90%",
        p: 2,
        display: "grid",
        gap: 1,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", // adaptivní mřížka
        alignItems: "center",
      }}
    >
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            m: 1,
            borderRadius: 2,
            boxShadow: 1,
            p: 1,
            // Změna pozadí na hover pokud je položka klikací
            "&:hover": {
              backgroundColor: item.link
                ? theme.palette.primary.main
                : "transparent",
            },
            cursor: item.link ? "pointer" : "default",
          }}
          // Kliknutí přesměruje na odpovídající stránku
          onClick={() => item.link && router.push(item.link)}
        >
          {item.icon}
          <Typography>
            {item.label}:{" "}
            <span style={{ fontWeight: "bold" }}>{item.value}</span>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default OverviewWidget;
