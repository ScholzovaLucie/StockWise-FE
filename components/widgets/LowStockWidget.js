import { getDashboardLowStock } from "/services/dashboardService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useClient } from "/context/clientContext";

const LowStockWidget = () => {
  const router = useRouter();
  const [lowStock, setLowStock] = useState([]);
  const { selectedClient } = useClient();

  useEffect(() => {
    getDashboardLowStock({ clientId: selectedClient })
      .then((data) => setLowStock(data))
      .catch((err) => console.error(err));
  }, [selectedClient]);

  return (
    <Box
      sx={{
        overflow: "auto",
        height: "90%",
        p: 1,
        display: "grid",
        gap: 1,
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", // Adaptivní sloupce
        alignItems: "center",
      }}
    >
      {lowStock.length > 0 ? (
        lowStock.map((row, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 0.5,
              p: 1,
              backgroundColor: "#fff5f5",
              borderRadius: 2,
              boxShadow: 1,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#ffe0e0" },
            }}
            onClick={() => router.push(`/app/products?search=${row.name}`)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <WarningAmberIcon sx={{ color: "orange" }} />
              <Typography sx={{ fontWeight: "bold" }}>{row.name}</Typography>
            </Box>
            <Typography sx={{ color: "red", fontWeight: "bold" }}>
              {row.amount}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
          Všechny produkty mají dostatečné zásoby.
        </Typography>
      )}
    </Box>
  );
};

export default LowStockWidget;
