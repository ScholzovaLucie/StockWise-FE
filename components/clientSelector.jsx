"use client";

import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useClient } from "/context/clientContext";
import clientService from "../services/clientService";

export default function ClientSelector() {
  const { selectedClient, setSelectedClient } = useClient();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event) => {
    const value = event.target.value === "all" ? null : event.target.value; // Pokud je vybrán "all", nastavíme null
    setSelectedClient(value);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await clientService.getAll();
        setClients(data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 200, marginRight: 2 }}>
      <InputLabel id="client-selector-label">Select Client</InputLabel>
      <Select
        labelId="client-selector-label"
        value={selectedClient === null ? "all" : selectedClient} // Pokud je null, zobrazíme "all"
        onChange={handleChange}
        label="Select Client"
      >
        <MenuItem value="all">All clients</MenuItem> {/* Přidáme možnost zobrazit všechna data */}
        {clients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}