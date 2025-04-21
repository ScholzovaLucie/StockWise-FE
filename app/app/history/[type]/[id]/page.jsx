"use client";
import { useParams } from "next/navigation";
import HistoryTimeline from "/components/historyTimeline";
import { Typography, Box } from "@mui/material";

export default function HistoryPage() {
  const { type, id } = useParams();

  return (
    <Box sx={{ mt: 4 }}>
      <HistoryTimeline type={type} relatedId={id} />
    </Box>
  );
}
