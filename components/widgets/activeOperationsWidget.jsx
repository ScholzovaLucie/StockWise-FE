"use client";

import React from "react";
import { getDashboardActiveOperations } from "services/dashboardService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography } from "@mui/material";
import { useClient } from "context/clientContext";
import { useTheme } from "@mui/material";

// Funkce vrací barvu podle stavu operace
const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "#4caf50"; // zelená pro dokončené
    case "BOX":
      return "#ff9800"; // oranžová pro zabaleno
    case "CANCELLED":
      return "#f44336"; // červená pro zrušeno
    default:
      return "#9e9e9e"; // šedá pro ostatní stavy
  }
};

const ActiveOperationsWidget = () => {
  // Získání aktuálně vybraného klienta z kontextu
  const { selectedClient } = useClient();

  // Lokální stav pro seznam aktivních operací
  const [operations, setOperations] = useState([]);

  // Pro navigaci mezi stránkami
  const router = useRouter();

  // Pro získání tématu (např. barvy)
  const theme = useTheme();

  // Načtení aktivních operací při změně klienta
  useEffect(() => {
    getDashboardActiveOperations({ clientId: selectedClient })
      .then((data) => setOperations(data)) // úspěšné načtení
      .catch((err) => console.error(err)); // chyba při načítání
  }, [selectedClient]);

  return (
    <Box
      sx={{
        overflow: "auto", // posuvník pokud je obsah větší než výška
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
            // Po kliknutí přesměruje na detail operace podle čísla
            onClick={() => router.push(`/app/operations?search=${op.number}`)}
          >
            {/* Informace o operaci */}
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

            {/* Barevný indikátor stavu operace */}
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
        // Zobrazení hlášky, pokud nejsou žádné aktivní operace
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
          Žádné aktivní operace.
        </Typography>
      )}
    </Box>
  );
};

export default ActiveOperationsWidget;
