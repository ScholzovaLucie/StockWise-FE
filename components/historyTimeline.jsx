import React, { useEffect, useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import { Paper, Typography, CircularProgress, Box } from "@mui/material";
import historyService from "services/historyService";
import operationService from "services/operationService";
import productService from "services/productService";
import positionService from "services/positionService";
import batchService from "services/batchService";
import { format } from "date-fns";
import {
  Inventory2 as ProductIcon,
  Handyman as OperationIcon,
  Category as BatchIcon,
  Groups as GroupIcon,
  LocationOn as PositionIcon,
} from "@mui/icons-material";
import groupService from "services/groupService";

// Mapování typů historie na ikonky a barvy pro Timeline
const typeMap = {
  operation: { label: "Operace", icon: <OperationIcon />, color: "primary" },
  product: { label: "Produkt", icon: <ProductIcon />, color: "success" },
  batch: { label: "Šarže", icon: <BatchIcon />, color: "warning" },
  group: { label: "Skupina", icon: <GroupIcon />, color: "secondary" },
  position: { label: "Pozice", icon: <PositionIcon />, color: "info" },
};

const HistoryTimeline = ({ type = null, relatedId = null }) => {
  const [history, setHistory] = useState([]); // Seznam historických záznamů
  const [loading, setLoading] = useState(true); // Indikace načítání
  const [identifier, setIdentifier] = useState(null); // Jedinečný identifikátor entity
  const [name, setName] = useState(""); // Název typu entity pro nadpis

  // Načítání historie podle typu a ID entity
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = relatedId ? { related_id: relatedId } : {};
      let data;
      let instance;

      if (type) {
        switch (type) {
          case "operation":
            data = await historyService.getOperationHistory(params);
            instance = await operationService.getById(relatedId);
            setIdentifier(instance.number);
            setName("operace");
            break;
          case "product":
            data = await historyService.getProductHistory(params);
            instance = await productService.getById(relatedId);
            setIdentifier(instance.code);
            setName("produkt");
            break;
          case "batch":
            data = await historyService.getBatchHistory(params);
            instance = await batchService.getById(relatedId);
            setIdentifier(instance.ean);
            setName("šarže");
            break;
          case "group":
            data = await historyService.getGroupHistory(params);
            instance = await groupService.getById(relatedId);
            setIdentifier(instance.name);
            setName("skupina");
            break;
          case "position":
            data = await historyService.getPositionHistory(params);
            instance = await positionService.getById(relatedId);
            setIdentifier(instance.ean);
            setName("pozice");
            break;
          default:
            data = await historyService.getAll(params);
            setIdentifier("all");
            setName("");
        }
      } else {
        data = await historyService.getAll(params);
        setIdentifier("all");
      }

      // Uložení výsledků (ošetření response formátu)
      setHistory(Array.isArray(data.results) ? data.results : []);
    } catch (e) {
      console.error("Chyba při načítání historie:", e.message);
    } finally {
      setLoading(false);
    }
  };

  // Načtení historie při změně typu nebo ID
  useEffect(() => {
    fetchHistory();
  }, [type, relatedId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Nadpis s typem a identifikátorem entity */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        Historie {name}: {identifier}
      </Typography>

      {/* Timeline komponenta pro zobrazení historie */}
      <Timeline position="alternate">
        {history.map((item) => {
          const { id, type, timestamp, description, user } = item;
          const itemType = typeMap[type] || {};
          const formattedDate = format(new Date(timestamp), "d.M.yyyy HH:mm");

          return (
            <TimelineItem key={id}>
              <TimelineOppositeContent color="text.secondary">
                {formattedDate}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={itemType.color || "grey"}>
                  {itemType.icon || "?"}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {itemType.label || type}
                  </Typography>
                  <Typography>{description}</Typography>
                  {user?.username && (
                    <Typography variant="caption" color="text.secondary">
                      Uživatel: {user.username}
                    </Typography>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </>
  );
};

export default HistoryTimeline;
