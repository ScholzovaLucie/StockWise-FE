"use client";

import React from "react";
import { getDashboardEfficiency } from "services/dashboardService";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { useClient } from "context/clientContext";

const EfficiencyWidget = () => {
  // Lokální stav pro data o efektivitě
  const [efficiencyData, setEfficiencyData] = useState(null);

  // Vybraný klient z globálního kontextu
  const { selectedClient } = useClient();

  // Načtení dat o efektivitě při změně klienta
  useEffect(() => {
    getDashboardEfficiency({ clientId: selectedClient })
      .then((data) => setEfficiencyData(data)) // Uložení získaných dat
      .catch((err) => console.error(err)); // Logování chyby
  }, [selectedClient]);

  // Zobrazit text při čekání na data
  if (!efficiencyData) {
    return <Typography>Načítám data...</Typography>;
  }

  // Destrukturalizace dat z odpovědi
  const { efficiency, weeklyEfficiency, avgEfficiency } = efficiencyData;

  // Funkce pro určení barvy podle hodnoty efektivity
  const getColor = (value) => {
    if (value < 50) return "#f44336"; // Červená – nízká efektivita
    if (value < 80) return "#ff9800"; // Oranžová – střední efektivita
    return "#4caf50"; // Zelená – vysoká efektivita
  };

  return (
    <Paper sx={{ overflow: "auto", height: "80%", p: 3, textAlign: "center" }}>
      {/* Kruh s aktuální efektivitou */}
      <Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
        <CircularProgress
          variant="determinate"
          value={efficiency} // procentuální hodnota
          size={100}
          thickness={5}
          sx={{ color: getColor(efficiency) }} // barva dle efektivity
        />
        {/* Číslo uprostřed kruhu */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {efficiency.toFixed(1)}%
          </Typography>
        </Box>
      </Box>

      {/* Oddělení aktuálního stavu od statistik */}
      <Divider sx={{ my: 2 }} />

      {/* Statistiky za týden a průměrná efektivita */}
      <Typography variant="body2">
        Tento týden: <strong>{weeklyEfficiency.toFixed(1)}%</strong>
      </Typography>
      <Typography variant="body2">
        Historický průměr: <strong>{avgEfficiency.toFixed(1)}%</strong>
      </Typography>
    </Paper>
  );
};

export default EfficiencyWidget;
