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

const typeMap = {
  operation: { label: "Operace", icon: <OperationIcon />, color: "primary" },
  product: { label: "Produkt", icon: <ProductIcon />, color: "success" },
  batch: { label: "Šarže", icon: <BatchIcon />, color: "warning" },
  group: { label: "Skupina", icon: <GroupIcon />, color: "secondary" },
  position: { label: "Pozice", icon: <PositionIcon />, color: "info" },
};

const HistoryTimeline = ({ type = null, relatedId = null }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [identifier, setIdentifier] = useState(null);

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
            break;
          case "product":
            data = await historyService.getProductHistory(params);
            instance = await productService.getById(relatedId);
            setIdentifier(instance.code);
            break;
          case "batch":
            data = await historyService.getBatchHistory(params);
            instance = await batchService.getById(relatedId);
            setIdentifier(instance.ean);
            break;
          case "group":
            data = await historyService.getGroupHistory(params);
            instance = await groupService.getById(relatedId);
            setIdentifier(instance.name);
            break;
          case "position":
            data = await historyService.getPositionHistory(params);
            instance = await positionService.getById(relatedId);
            setIdentifier(instance.ean);
            break;
          default:
            data = await historyService.getAll(params);
            setIdentifier("all");
        }
      } else {
        data = await historyService.getAll(params);
        setIdentifier("all");
      }

      setHistory(Array.isArray(data.results) ? data.results : []);
    } catch (e) {
      console.error("Chyba při načítání historie:", e.message);
    } finally {
      setLoading(false);
    }
  };

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
      <Typography variant="h4" sx={{ mb: 2 }}>
        Historie {type}: {identifier}
      </Typography>
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
