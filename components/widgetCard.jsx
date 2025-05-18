import React from "react";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  OverviewWidget,
  ActiveOperationsWidget,
  EfficiencyWidget,
  StatsWidget,
  ExtendedStatsWidget,
  LowStockWidget,
  RecentActivityWidget,
} from "./widgets";

const widgetComponents = {
  overview: OverviewWidget,
  activeOperations: ActiveOperationsWidget,
  efficiency: EfficiencyWidget,
  stats: StatsWidget,
  extendedStats: ExtendedStatsWidget,
  lowStock: LowStockWidget,
  recentActivity: RecentActivityWidget,
};

const WidgetCard = ({ widget, removeWidget }) => {
  const WidgetComponent = widgetComponents[widget.type];

  return (
    <div key={widget.id} data-grid={widget.layout}>
      <Paper
        sx={{ position: "relative", height: "100%", p: 1, overflow: "hidden" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6">{widget.type}</Typography>
          <IconButton onClick={() => removeWidget(widget.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
        {WidgetComponent ? (
          <WidgetComponent />
        ) : (
          <Typography>Neznámý widget</Typography>
        )}
      </Paper>
    </div>
  );
};

export default WidgetCard;
