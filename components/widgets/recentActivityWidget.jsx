"use client";

import React from "react";
import { getDashboardRecentActivity } from "services/dashboardService";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Paper, Select, MenuItem, FormControl, TextField } from "@mui/material";
import { useClient } from "context/clientContext";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const RecentActivityWidget = () => {
  // Data o aktivitách (pro graf a seznam)
  const [activities, setActivities] = useState({ chart: [], recent: [] });

  // Filtrování dle typu entity (např. operation)
  const [selectedType, setSelectedType] = useState("");

  // Výběr časového období
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Pro vlastní výběr období
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Aktuálně vybraný klient
  const { selectedClient } = useClient();

  // Načtení dat při změně filtrů nebo klienta
  useEffect(() => {
    let filters = { type: selectedType };

    // Dynamické nastavení časového rozsahu
    if (selectedPeriod === "week") {
      filters.from_date = new Date(new Date().setDate(new Date().getDate() - 7))
        .toISOString()
        .split("T")[0];
    } else if (selectedPeriod === "month") {
      filters.year = new Date().getFullYear();
      filters.month = new Date().getMonth() + 1;
    } else if (selectedPeriod === "year") {
      filters.year = new Date().getFullYear();
    } else if (selectedPeriod === "custom" && customFrom && customTo) {
      filters.from_date = customFrom;
      filters.to_date = customTo;
    }

    // Načtení dat z API
    getDashboardRecentActivity({ filters: filters, clientId: selectedClient })
      .then((data) => setActivities(data))
      .catch((err) => console.error(err));
  }, [selectedClient, selectedType, selectedPeriod, customFrom, customTo]);

  // Typy aktivit, které se budou zobrazovat v grafu
  const types = ["operation", "product", "batch", "position"];

  // Barvy přiřazené jednotlivým typům
  const colors = {
    operation: "#42a5f5",
    product: "#66bb6a",
    batch: "#ff7043",
    position: "#ab47bc",
  };

  // Vygenerování seznamu unikátních dat
  const labels = [
    ...new Set(
      activities.chart.map((item) => new Date(item.date).toLocaleDateString())
    ),
  ];

  // Datasety pro každý typ aktivity
  const datasets = types.map((type) => {
    const dataPoints = labels.map((label) => {
      const item = activities.chart.find(
        (activity) =>
          new Date(activity.date).toLocaleDateString() === label &&
          activity[type] !== undefined
      );
      return item ? item[type] : 0;
    });

    return {
      label: type.charAt(0).toUpperCase() + type.slice(1),
      data: dataPoints,
      borderColor: colors[type],
      backgroundColor: colors[type] + "33", // Průhledná barva pro body
      fill: false,
    };
  });

  // Finalizace dat pro graf
  const chartData = {
    labels,
    datasets,
  };

  return (
    <Paper
      sx={{
        overflow: "auto",
        height: "90%",
        p: 2,
        gap: 1,
        textAlign: "center",
      }}
    >
      {/* Výběr období */}
      <FormControl sx={{ minWidth: 100, marginRight: 1, mb: 1 }} size="small">
        <Select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <MenuItem value="week">Týden</MenuItem>
          <MenuItem value="month">Měsíc</MenuItem>
          <MenuItem value="year">Rok</MenuItem>
          <MenuItem value="custom">Vlastní</MenuItem>
        </Select>
      </FormControl>

      {/* Vlastní výběr datumu */}
      {selectedPeriod === "custom" && (
        <>
          <TextField
            label="Od"
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            sx={{ marginRight: 1, width: 160 }}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Do"
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            sx={{ width: 160 }}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}

      {/* Vykreslení grafu aktivit */}
      <Line data={chartData} options={{ responsive: true }} />
    </Paper>
  );
};

export default RecentActivityWidget;
