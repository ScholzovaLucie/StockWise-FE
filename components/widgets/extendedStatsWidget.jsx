"use client";

import React from "react";
import { getDashboardExtendedStats } from "services/dashboardService";
import { useEffect, useState } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useClient } from "context/clientContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ExtendedStatsWidget = () => {
  // Stav pro uložená data o rozšířených statistikách
  const [extendedStats, setExtendedStats] = useState(null);

  // Vybraný klient z kontextu
  const { selectedClient } = useClient();

  // Načtení dat při změně klienta
  useEffect(() => {
    getDashboardExtendedStats({ clientId: selectedClient })
      .then((data) => setExtendedStats(data)) // úspěšné načtení dat
      .catch((err) => console.error(err)); // logování chyby
  }, [selectedClient]);

  // Zobrazí se text při čekání na data
  if (!extendedStats) {
    return <Typography>Načítám rozšířené statistiky...</Typography>;
  }

  // Vygenerování seznamu všech unikátních dat
  const labels = [
    ...new Set(
      extendedStats.trend.map((item) => new Date(item.day).toLocaleDateString())
    ),
  ];

  // Barvy pro jednotlivé uživatele
  const colors = ["#42a5f5", "#66bb6a", "#ff7043", "#ab47bc", "#fbc02d"];

  // Extrakce všech unikátních uživatelů ze statistik
  const users = [
    ...new Set(extendedStats.trend.map((item) => item.user__name)),
  ];

  // Generování datasetů pro každý uživatelský graf
  const datasets = users.map((user, index) => {
    // Pro každé datum najdi počet operací daného uživatele
    const dataPoints = labels.map((date) => {
      const item = extendedStats.trend.find(
        (entry) =>
          new Date(entry.day).toLocaleDateString() === date &&
          entry.user__name === user
      );
      return item ? item.count : 0;
    });

    // Dataset pro daného uživatele
    return {
      label: user,
      data: dataPoints,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + "33",
      fill: false,
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  return (
    <Paper
      sx={{
        overflow: "auto",
        height: "90%",
        p: 1,
        gap: 1,
        textAlign: "center",
      }}
    >
      {/* Zobrazení průměrné doby dokončení operace */}
      <Typography variant="body1" gutterBottom sx={{ m: 1 }}>
        Průměrná doba dokončení: {extendedStats.avgCompletionTime.toFixed(2)}{" "}
        minut
      </Typography>

      {/* Vykreslení čárového grafu */}
      <Line sx={{ m: 1 }} data={chartData} options={{ responsive: true }} />
    </Paper>
  );
};

export default ExtendedStatsWidget;
