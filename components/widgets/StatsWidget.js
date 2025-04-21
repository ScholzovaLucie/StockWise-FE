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

// 🔧 Registrace Chart.js komponent
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatsWidget = () => {
  const [stats, setStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const { selectedClient } = useClient();

  useEffect(() => {
    let filters = {};

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

    getDashboardStats({ filters: filters, clientId: selectedClient })
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, [selectedClient, selectedPeriod, customFrom, customTo]);

  if (!stats) {
    return <Typography>Načítám data...</Typography>;
  }

  // 📊 Data pro graf
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

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
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
      {/* 🔽 Výběr období */}
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

      {/* 🔽 Vlastní období */}
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

      {/* 📊 Graf */}
      <Bar sx={{ m: 1 }} data={chartData} options={options} />
    </Paper>
  );
};

export default StatsWidget;
