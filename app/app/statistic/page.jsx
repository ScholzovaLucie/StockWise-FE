"use client";

import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  Box,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import StatsWidget from "/components/statsWidget";
import STAT_LABELS from "/constants";
import { getUserWidgets, saveUserWidgets } from "/services/dashboardService";
import { useClient } from "/context/clientContext";

const ResponsiveGridLayout = WidthProvider(Responsive);

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 9, md: 6, sm: 4, xs: 2, xxs: 1 };

const getDefaultLayout = (id) => ({
  i: id,
  x: 0,
  y: 0, // původně Infinity
  w: 3,
  h: 6,
  isDraggable: false,
  isResizable: false,
  moved: false,
  static: false,
});

const StatsDashboardPage = () => {
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({ lg: [] });
  const [editMode, setEditMode] = useState(false);
  const { selectedClient } = useClient();

  useEffect(() => {
    getUserWidgets(true)
      .then((data) => {
        let widgetsData = data.widgets || [];
        let layoutData = data.layout || { lg: [] };

        if (!widgetsData.length) {
          widgetsData = [
            {
              id: "stockSummary",
              type: "stockSummary",
              layout: getDefaultLayout("stockSummary"),
            },
            {
              id: "lowStock",
              type: "lowStock",
              layout: getDefaultLayout("lowStock"),
            },
            {
              id: "topProducts",
              type: "topProducts",
              layout: getDefaultLayout("topProducts"),
            },
            {
              id: "monthlyOverview",
              type: "stmonthlyOverviewats",
              layout: getDefaultLayout("monthlyOverview"),
            },
          ];
          layoutData.lg = widgetsData.map((widget) => widget.layout);
        }

        setWidgets(widgetsData);
        console.log("layoutData", layoutData);
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

    saveUserWidgets(
      { widgets: updatedWidgets, layout: cleanedLayouts },
      true
    ).catch(console.error);
  };

  const removeWidget = (id) => {
    const updatedWidgets = widgets.filter((widget) => widget.id !== id);
    const updatedLayouts = {
      lg: layouts.lg.filter((layout) => layout.i !== id),
    };

    setWidgets(updatedWidgets);
    setLayouts(updatedLayouts);

    saveUserWidgets(
      { widgets: updatedWidgets, layout: updatedLayouts },
      true
    ).catch(console.error);
  };

  const addWidget = (widgetType) => {
    if (widgets.some((widget) => widget.type === widgetType)) return;
    const id = widgetType;
    const newWidget = { id, type: widgetType, layout: getDefaultLayout(id) };

    const updatedWidgets = [...widgets, newWidget];
    const updatedLayouts = { lg: [...layouts.lg, newWidget.layout] };

    const cleanedLayouts = cleanLayout(updatedLayouts);

    setWidgets(updatedWidgets);
    console.log("updatedLayouts", updatedLayouts);
    setLayouts(updatedLayouts);

    saveUserWidgets(
      {
        widgets: updatedWidgets,
        layout: cleanLayout(cleanedLayouts),
      },
      true
    ).catch(console.error);
  };

  const onLayoutChange = (currentLayout, allLayouts) => {
    if (editMode) {
      console.log("allLayouts", allLayouts);
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
      saveUserWidgets(
        {
          widgets: updatedWidgets,
          layout: cleanedLayouts,
        },
        true
      ).catch(console.error);
    }
  };

  return selectedClient ? (
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

        {editMode && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="add-widget-label">Vyber statistiku</InputLabel>
              <Select
                labelId="add-widget-label"
                onChange={(e) => addWidget(e.target.value)}
                defaultValue=""
              >
                <MenuItem value="">
                  <em>Vyber</em>
                </MenuItem>
                {Object.keys(STAT_LABELS)
                  .filter((id) => !widgets.some((w) => w.id === id))
                  .map((key) => (
                    <MenuItem key={key} value={key}>
                      {STAT_LABELS[key]}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
      <ResponsiveGridLayout
        key={editMode}
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={30}
        width={typeof window !== "undefined" ? window.innerWidth : 1200}
        onLayoutChange={onLayoutChange}
        preventCollision={false}
        compactType="vertical"
        isResizable={editMode}
        isDraggable={editMode}
      >
        {widgets.map((w) => (
          <div
            key={w.id}
            data-grid={{
              ...w.layout,
              isDraggable: editMode,
              isResizable: editMode,
            }}
            style={{
              width: "auto",
              height: "auto",
            }}
          >
            <StatsWidget id={w.id} onRemove={removeWidget} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </Box>
  ) : (
    <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
      Není vybrán žádný klient. Pro zobrazení dashboardu prosím vyberte klienta.
    </Alert>
  );
};

export default StatsDashboardPage;
