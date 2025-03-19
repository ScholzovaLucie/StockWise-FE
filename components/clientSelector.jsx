"use client";

import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useClient } from "/context/clientContext";
import clientService from "/services/clientService";
import { useMessage } from "/context/messageContext";
import CircularProgress from "@mui/material/CircularProgress";

export default function ClientSelector() {
  const { selectedClient, setSelectedClient } = useClient();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setMessage } = useMessage();

  const handleChange = (event) => {
    const value = event.target.value === "all" ? null : event.target.value;
    setSelectedClient(value);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await clientService.getAll();
        setClients(data);
        if (data.any((client) => client.id !== selectedClient)) {
          setSelectedClient(null);
        }
      } catch (error) {
        setMessage("Error loading data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedClient]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{ minWidth: 200, marginRight: 2 }}
    >
      <InputLabel id="client-selector-label">Select Client</InputLabel>
      <Select
        labelId="client-selector-label"
        value={selectedClient === null ? "all" : selectedClient}
        onChange={handleChange}
        label="Select Client"
      >
        {clients.length > 0 ? (
          <MenuItem value="all">All clients</MenuItem>
        ) : null}
        {clients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
