"use client";

import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useClient } from "context/clientContext";
import clientService from "services/clientService";
import { useMessage } from "context/messageContext";
import CircularProgress from "@mui/material/CircularProgress";

export default function ClientSelector() {
  const { selectedClient, setSelectedClient } = useClient(); // Získání a nastavení aktuálně vybraného klienta z kontextu
  const [clients, setClients] = useState([]); // Stav pro uchování seznamu klientů
  const [isLoading, setIsLoading] = useState(true); // Stav pro indikaci načítání dat
  const { setMessage } = useMessage(); // Funkce pro zobrazení zprávy (např. chyba při načítání)

  // Změna vybraného klienta při výběru v selectu
  const handleChange = (event) => {
    const value = event.target.value === "all" ? null : event.target.value;
    setSelectedClient(value);
  };

  // Načtení klientů při změně `selectedClient` (může být diskutabilní – typicky se načítá jen jednou při mountu)
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await clientService.getAll({ no_page: 1 });
        console.log(data);
        setClients(Array.isArray(data?.results) ? data.results : data); // Ošetření různých struktur odpovědi (tip: pravděpodobně překlep ve "resluts")
      } catch (error) {
        setMessage("Error loading data: " + error.message); // Nastavení chybové zprávy
      } finally {
        setIsLoading(false); // Skrytí loaderu po dokončení
      }
    };

    loadData();
  }, [selectedClient]);

  if (isLoading) {
    return <CircularProgress />; // Zobrazení loaderu během načítání
  }

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{ minWidth: 200, marginRight: 2 }}
    >
      <InputLabel id="client-selector-label">Select Client</InputLabel>
      <Select
        MenuProps={{ disablePortal: true }}
        labelId="client-selector-label"
        value={
          clients.length > 0
            ? selectedClient === null
              ? "all"
              : selectedClient
            : ""
        } // Pokud není vybrán žádný klient, zobrazí "All"
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
