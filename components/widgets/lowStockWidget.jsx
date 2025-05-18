"use client";

import React from "react";
import { getDashboardLowStock } from "services/dashboardService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useClient } from "context/clientContext";
import { useTheme } from "@mui/material";

const LowStockWidget = () => {
  // Hook pro navigaci mezi stránkami
  const router = useRouter();

  // Lokální stav pro produkty s nízkým skladem
  const [lowStock, setLowStock] = useState([]);

  // Vybraný klient z kontextu
  const { selectedClient } = useClient();

  // Přístup k aktuálnímu tématu (např. barvám)
  const theme = useTheme();

  // Načítání produktů s nízkým skladem při změně klienta
  useEffect(() => {
    getDashboardLowStock({ clientId: selectedClient })
      .then((data) => setLowStock(data)) // Úspěšné načtení dat
      .catch((err) => console.error(err)); // Chybové hlášení
  }, [selectedClient]);

  return (
    <Box
      sx={{
        overflow: "auto", // Umožní scrollování v případě přetečení
        height: "90%",
        p: 1,
        display: "grid",
        gap: 1,
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", // Adaptivní počet sloupců
        alignItems: "center",
      }}
    >
      {lowStock.length > 0 ? (
        // Zobrazení každého produktu s nízkým množstvím
        lowStock.map((row, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 0.5,
              p: 1,
              borderRadius: 2,
              boxShadow: 1,
              cursor: "pointer",
              "&:hover": { backgroundColor: theme.palette.primary.main },
            }}
            // Kliknutí přesměruje na vyhledání produktu
            onClick={() => router.push(`/app/products?search=${row.name}`)}
          >
            {/* Ikona + název produktu */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <WarningAmberIcon sx={{ color: "orange" }} />
              <Typography sx={{ fontWeight: "bold" }}>{row.name}</Typography>
            </Box>

            {/* Zobrazení aktuálního množství */}
            <Typography sx={{ color: "red", fontWeight: "bold" }}>
              {row.amount_cached}
            </Typography>
          </Box>
        ))
      ) : (
        // Pokud nejsou žádné produkty s nízkým skladem
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
          Všechny produkty mají dostatečné zásoby.
        </Typography>
      )}
    </Box>
  );
};

export default LowStockWidget;
