import { getDashboardEfficiency } from "/services/dashboardService";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { useClient } from "/context/clientContext";

const EfficiencyWidget = () => {
  const [efficiencyData, setEfficiencyData] = useState(null);
  const { selectedClient } = useClient();

  useEffect(() => {
    getDashboardEfficiency({ clientId: selectedClient })
      .then((data) => setEfficiencyData(data))
      .catch((err) => console.error(err));
  }, [selectedClient]);

  if (!efficiencyData) {
    return <Typography>Načítám data...</Typography>;
  }

  const { efficiency, weeklyEfficiency, avgEfficiency } = efficiencyData;

  // 🎨 Dynamické barvy podle efektivity
  const getColor = (value) => {
    if (value < 50) return "#f44336"; // Červená (špatná efektivita)
    if (value < 80) return "#ff9800"; // Žlutá (průměrná efektivita)
    return "#4caf50"; // Zelená (dobrá efektivita)
  };

  return (
    <Paper sx={{ overflow: "auto", height: "80%", p: 3, textAlign: "center" }}>
      {/* 🟢 Progress bar */}
      <Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
        <CircularProgress
          variant="determinate"
          value={efficiency}
          size={100}
          thickness={5}
          sx={{ color: getColor(efficiency) }}
        />
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

      <Divider sx={{ my: 2 }} />

      {/* 📊 Trendová statistika */}
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
