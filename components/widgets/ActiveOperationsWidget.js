import { getDashboardActiveOperations } from "services/dashboardService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography } from "@mui/material";
import { useClient } from "context/clientContext";
import { useTheme } from "@mui/material";

// 🏷 Funkce pro barevné označení stavů operací
const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "#4caf50"; // Zelená
    case "BOX":
      return "#ff9800"; // Oranžová
    case "CANCELLED":
      return "#f44336"; // Červená
    default:
      return "#9e9e9e"; // Šedá
  }
};

const ActiveOperationsWidget = () => {
  const { selectedClient } = useClient();
  const [operations, setOperations] = useState([]);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    getDashboardActiveOperations({ clientId: selectedClient })
      .then((data) => setOperations(data))
      .catch((err) => console.error(err));
  }, [selectedClient]);

  return (
    <Box
      sx={{
        overflow: "auto",
        height: "90%",
        p: 2,
        display: "grid",
        gap: 1,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        alignItems: "center",
      }}
    >
      {operations.length > 0 ? (
        operations.map((op) => (
          <Box
            key={op.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              p: 1,
              borderRadius: 2,
              boxShadow: 1,
              cursor: "pointer",
              "&:hover": { backgroundColor: theme.palette.primary.main },
            }}
            onClick={() => router.push(`/app/operations?search=${op.number}`)}
          >
            {/* Info o operaci */}
            <Box>
              <Typography variant="body2">
                <strong>ID:</strong> {op.id}
              </Typography>
              <Typography variant="body2">
                <strong>Typ:</strong> {op.type}
              </Typography>
              <Typography variant="body2">
                <strong>Číslo:</strong> {op.number}
              </Typography>
            </Box>

            {/* Indikátor stavu */}
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: getStatusColor(op.status),
              }}
            />
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
          Žádné aktivní operace.
        </Typography>
      )}
    </Box>
  );
};

export default ActiveOperationsWidget;
