"use client";

import React from "react";
import { getDashboardStats } from "services/dashboardService";
import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useClient } from "context/clientContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatsWidget = () => {
  // Stav pro získaná statistická data
  const [stats, setStats] = useState(null);

  // Vybrané období (týden, měsíc, rok, vlastní)
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Vlastní datumové období
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Aktuálně vybraný klient z kontextu
  const { selectedClient } = useClient();

  // Efekt pro načtení dat při změně filtrů nebo klienta
  useEffect(() => {
    let filters = {};

    // Nastavení filtrů dle vybraného období
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

    // Volání API pro načtení dat
    getDashboardStats({ filters: filters, clientId: selectedClient })
      .then((data) => setStats(data)) // Uložení dat
      .catch((err) => console.error(err)); // Logování chyby
  }, [selectedClient, selectedPeriod, customFrom, customTo]);

  // Zobrazení při čekání na data
  if (!stats) {
    return <Typography>Načítám data...</Typography>;
  }

  // Data pro sloupcový graf
  const chartData = {
    labels: ["Dokončené", "Zrušené", "Probíhající"],
    datasets: [
      {
        label: "Operace",
        data: [
          stats.completedOperations,
          stats.cancelledOperations,
          stats.inProgressOperations,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
      },
    ],
  };

  // Nastavení chování grafu
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <Paper
      sx={{
        overflow: "auto", // scroll při přetečení
        height: "90%",
        p: 2,
        gap: 1,
        textAlign: "center",
      }}
    >
      {/* 🔽 Výběr období pro statistiku */}
      <FormControl
        sx={{ minWidth: 100, marginRight: 1, marginBottom: 1 }}
        size="small"
      >
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

      {/* 🧾 Vlastní datumové období */}
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

      {/* 📊 Sloupcový graf s přehledem operací */}
      <Bar sx={{ m: 1 }} data={chartData} options={options} />
    </Paper>
  );
};

export default StatsWidget;
