"use client";

import React, { useEffect, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Typography, Paper, IconButton, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactMarkdown from "react-markdown";

import chatbotService from "services/chatbotService";
import { useClient } from "context/clientContext";
import STAT_LABELS from "/constants";
import MarkdownRenderer from "components/markdownRenderer";

/**
 * Komponenta zobrazující widget se statistikou v rámci dashboardu
 * @param {{ id: string, onRemove: (id: string) => void }} props
 */
const StatsWidget = ({ id, onRemove }) => {
  const { selectedClient } = useClient(); // Získání ID vybraného klienta z kontextu
  const [statData, setStatData] = useState(null); // Výsledek statistiky (text, obrázek...)
  const [isLoading, setIsLoading] = useState(true); // Indikace načítání

  useEffect(() => {
    if (!selectedClient) return;

    // Načtení dat statistiky z backendu (chatbot API)
    const fetchStatData = async () => {
      try {
        const response = await chatbotService.getStat(id, selectedClient); // Statistika dle ID a klienta
        setStatData(response); // Např. { element: "img", src, alt } nebo { element: "p", content }
      } catch (error) {
        // Fallback při chybě načítání
        setStatData({
          element: "p",
          content: "Nepodařilo se načíst data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatData();
  }, [selectedClient, id]);

  // Funkce pro vykreslení obsahu widgetu
  const renderContent = () => {
    if (isLoading) {
      return <CircularProgress size={24} />;
    }

    if (statData?.element === "img") {
      return (
        <img
          src={statData.src}
          alt={statData.alt}
          style={{ maxWidth: "100%", maxHeight: "80%" }}
        />
      );
    }

    return <MarkdownRenderer content={statData?.content} />; // Textová/statistická data
  };

  return (
    <Paper
      sx={{ p: 2, height: "100%", position: "relative", overflow: "auto" }}
      elevation={3}
    >
      {/* Nadpis widgetu */}
      <Typography variant="h6" gutterBottom>
        {STAT_LABELS[id] ?? "Statistika"}
      </Typography>

      {/* Tlačítko pro odstranění widgetu */}
      <IconButton
        aria-label="Smazat widget"
        sx={{ position: "absolute", top: 5, right: 5 }}
        onClick={() => onRemove(id)}
      >
        <DeleteIcon />
      </IconButton>

      {/* Obsah widgetu (graf, markdown, text...) */}
      {renderContent()}
    </Paper>
  );
};

export default StatsWidget;
