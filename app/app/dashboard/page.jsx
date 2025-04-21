"use client";

import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getUserWidgets, saveUserWidgets } from "services/dashboardService";

import ActiveOperationsWidget from "components/widgets/ActiveOperationsWidget";
import EfficiencyWidget from "components/widgets/EfficiencyWidget";
import ExtendedStatsWidget from "components/widgets/ExtendedStatsWidget";
import LowStockWidget from "components/widgets/LowStockWidget";
import RecentActivityWidget from "components/widgets/RecentActivityWidget";
import OverviewWidget from "components/widgets/OverviewWidget";
import StatsWidget from "components/widgets/StatsWidget";
import { useClient } from "context/clientContext";

const ResponsiveGridLayout = WidthProvider(Responsive);

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 9, md: 6, sm: 4, xs: 2, xxs: 1 };

const widgetComponents = {
  overview: OverviewWidget,
  activeOperations: ActiveOperationsWidget,
  efficiency: EfficiencyWidget,
  stats: ExtendedStatsWidget,
  lowStock: LowStockWidget,
  recentActivity: RecentActivityWidget,
  statsWidget: StatsWidget,
};

const getWidgetTitle = (type) => {
  const titles = {
    overview: "Přehled skladu",
    activeOperations: "Aktivní operace",
    efficiency: "Efektivita skladu",
    stats: "Přehled aktivity uživatelů",
    extendedStats: "Rozšířené statistiky",
    lowStock: "Nízké zásoby",
    recentActivity: "Nedávná aktivita",
    statsWidget: "Statistiky operací",
  };
  return titles[type] || "Widget";
};

const getDefaultLayout = (id) => ({
  i: id,
  x: 0,
  y: Infinity,
  w: 3,
  h: 6,
  isDraggable: false,
  isResizable: false,
  moved: false,
  static: false,
});

const DashboardPage = () => {
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [] });
  const [editMode, setEditMode] = useState(false);
  const { selectedClient } = useClient();

  useEffect(() => {
    getUserWidgets()
      .then((data) => {
        let widgetsData = data.widgets || [];
        let layoutData = data.layout || { lg: [] };

        if (!widgetsData.length) {
          widgetsData = [
            {
              id: "overview",
              type: "overview",
              layout: getDefaultLayout("overview"),
            },
            {
              id: "activeOperations",
              type: "activeOperations",
              layout: getDefaultLayout("activeOperations"),
            },
            {
              id: "efficiency",
              type: "efficiency",
              layout: getDefaultLayout("efficiency"),
            },
            { id: "stats", type: "stats", layout: getDefaultLayout("stats") },
          ];
          layoutData.lg = widgetsData.map((widget) => widget.layout);
        }

        setWidgets(widgetsData);
        setLayouts(layoutData);
      })
      .catch(console.error);
  }, []);

  const cleanLayout = (layouts) => {
    return Object.fromEntries(
      Object.entries(layouts).map(([key, layout]) => [
        key,
        layout.map(
          ({ moved, isStatic, isDraggable, isResizable, ...rest }) => rest
        ),
      ])
    );
  };

  const toggleEditMode = () => {
    const newEditMode = !editMode;

    // Projde všechny widgety a upraví jejich vlastnosti podle editMode
    const updatedWidgets = widgets.map((widget) => ({
      ...widget,
      layout: {
        ...widget.layout,
        isDraggable: newEditMode,
        isResizable: newEditMode,
        moved: newEditMode,
        static: newEditMode,
      },
    }));

    const cleanedLayouts = cleanLayout(layouts);

    setEditMode(newEditMode);
    setWidgets(updatedWidgets);

    saveUserWidgets({ widgets: updatedWidgets, layout: cleanedLayouts }).catch(
      console.error
    );
  };

  const removeWidget = (id) => {
    const updatedWidgets = widgets.filter((widget) => widget.id !== id);
    const updatedLayouts = {
      lg: layouts.lg.filter((layout) => layout.i !== id),
    };

    setWidgets(updatedWidgets);
    setLayouts(updatedLayouts);

    saveUserWidgets({ widgets: updatedWidgets, layout: updatedLayouts }).catch(
      console.error
    );
  };

  const addWidget = (widgetType) => {
    if (widgets.some((widget) => widget.type === widgetType)) return;
    const id = widgetType;
    const newWidget = { id, type: widgetType, layout: getDefaultLayout(id) };

    const updatedWidgets = [...widgets, newWidget];
    const updatedLayouts = { lg: [...layouts.lg, newWidget.layout] };

    const cleanedLayouts = cleanLayout(updatedLayouts);

    setWidgets(updatedWidgets);
    setLayouts(updatedLayouts);

    saveUserWidgets({
      widgets: updatedWidgets,
      layout: cleanLayout(cleanedLayouts),
    }).catch(console.error);
  };

  const onLayoutChange = (currentLayout, allLayouts) => {
    if (editMode) {
      setLayouts(allLayouts);

      const updatedWidgets = widgets.map((widget) => ({
        ...widget,
        layout: {
          ...(currentLayout.find((layout) => layout.i === widget.id) ||
            widget.layout),
          isDraggable: editMode,
          isResizable: editMode,
          moved: editMode,
          static: editMode,
        },
      }));

      const cleanedLayouts = cleanLayout(allLayouts);
      setWidgets(updatedWidgets);
      saveUserWidgets({
        widgets: updatedWidgets,
        layout: cleanedLayouts,
      }).catch(console.error);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Přepínač edit mode */}
        <Tooltip title="Přepnout režim úprav">
          <IconButton
            color={editMode ? "primary" : "default"}
            onClick={toggleEditMode}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        {/* 📌 Select menu pro přidání widgetů */}
        {editMode && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1">Přidat widget:</Typography>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="add-widget-label">Vyber widget</InputLabel>
              <Select
                labelId="add-widget-label"
                onChange={(e) => addWidget(e.target.value)}
                disabled={!editMode}
                defaultValue=""
              >
                <MenuItem value="">
                  <em>Vyber widget</em>
                </MenuItem>
                {Object.keys(widgetComponents)
                  .filter(
                    (option) =>
                      !widgets.some((widget) => widget.type === option)
                  )
                  .map((option) => (
                    <MenuItem key={option} value={option}>
                      {getWidgetTitle(option)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
      {/* Responzivní grid layout */}
      <ResponsiveGridLayout
        key={editMode}
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={30}
        width={window.innerWidth}
        onLayoutChange={onLayoutChange}
        preventCollision={false}
        compactType="vertical"
        isResizable={editMode}
        isDraggable={editMode}
        moved={editMode}
        static={editMode}
      >
        {widgets.map((widget) => {
          const WidgetComponent = widgetComponents[widget.type];
          return (
            <div
              key={widget.id}
              data-grid={{
                ...widget.layout,
                isDraggable: editMode,
                isResizable: editMode,
              }}
            >
              <Paper sx={{ p: 2, height: "100%", position: "relative" }}>
                <Typography variant="h6">
                  {getWidgetTitle(widget.type)}
                </Typography>
                {editMode && (
                  <IconButton
                    sx={{ position: "absolute", top: 5, right: 5 }}
                    onClick={() => removeWidget(widget.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                {WidgetComponent && <WidgetComponent />}
              </Paper>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </Box>
  );
};

export default DashboardPage;
