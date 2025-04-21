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
 * @param {{ id: string, onRemove: (id: string) => void }} props
 */
const StatsWidget = ({ id, onRemove }) => {
  const { selectedClient } = useClient();
  const [statData, setStatData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedClient) return;

    const fetchStatData = async () => {
      try {
        const response = await chatbotService.getStat(id, selectedClient);
        setStatData(response);
      } catch (error) {
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

    return <MarkdownRenderer content={statData?.content} />;
  };

  return (
    <Paper
      sx={{ p: 2, height: "100%", position: "relative", overflow: "auto" }}
      elevation={3}
    >
      <Typography variant="h6" gutterBottom>
        {STAT_LABELS[id] ?? "Statistika"}
      </Typography>
      <IconButton
        aria-label="Smazat widget"
        sx={{ position: "absolute", top: 5, right: 5 }}
        onClick={() => onRemove(id)}
      >
        <DeleteIcon />
      </IconButton>
      {renderContent()}
    </Paper>
  );
};

export default StatsWidget;
