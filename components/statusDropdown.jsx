"use client";

import React from "react";
import { useState, useEffect } from "react";
import { MenuItem, Select, CircularProgress } from "@mui/material";
import operationService from "services/operationService";
import { useMessage } from "context/messageContext";

const StatusDropdown = ({ operationId, currentStatus, onUpdate, statuses }) => {
  const [status, setStatus] = useState(currentStatus ?? ""); // Aktuálně zvolený status
  const [loading, setLoading] = useState(false); // Indikace změny statusu
  const { message, setMessage } = useMessage();

  // Pokud se změní prop `currentStatus`, synchronizuj ho do lokálního stavu
  useEffect(() => {
    if (currentStatus) {
      setStatus(currentStatus);
    }
  }, [currentStatus]);

  // Handler pro změnu statusu v selectu
  const handleChange = async (event) => {
    const newStatus = event.target.value;
    setLoading(true);

    try {
      await operationService.updateOperationStatus(operationId, newStatus); // Update statusu v backendu
      setStatus(newStatus); // Lokální update
      if (onUpdate) onUpdate(); // Volitelný callback po úspěšné aktualizaci
    } catch (error) {
      setMessage(error.message); // Zobrazit chybu v UI
    } finally {
      setLoading(false);
    }
  };

  // Pokud probíhá změna, zobraz loader místo selectu
  return loading ? (
    <CircularProgress size={20} />
  ) : (
    <Select value={status || ""} onChange={handleChange} size="small">
      {statuses.map((s) => (
        <MenuItem key={s} value={s}>
          {s}
        </MenuItem>
      ))}
    </Select>
  );
};

export default StatusDropdown;
