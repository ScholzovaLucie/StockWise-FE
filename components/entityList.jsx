"use client";

import React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  Typography,
  Container,
  IconButton,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import debounce from "lodash.debounce";
import { useClient } from "context/clientContext";
import { useMessage } from "context/messageContext";

const EntityList = ({
  title,
  service,
  columns,
  searchData,
  addPath,
  viewPath,
  entityName = "položka",
  rowActions,
  noAction = false,
  extraToolbar = null,
  filters = {},
  filters_map = {},
}) => {
  const [entities, setEntities] = useState([]); // Data z API
  const [loading, setLoading] = useState(false); // Indikace načítání
  const [search, setSearch] = useState(searchData || ""); // Hodnota hledání
  const router = useRouter();
  const { selectedClient } = useClient(); // Vybraný klient z kontextu
  const { setMessage } = useMessage(); // Kontextová zpráva
  const [page, setPage] = useState(0); // Stránkování - aktuální stránka
  const [pageSize, setPageSize] = useState(10); // Počet záznamů na stránku
  const [rowCount, setRowCount] = useState(0); // Celkový počet řádků
  const fetchedOnce = useRef(false); // Zajištění jednoho fetchu při mountu

  // Načtení dat podle vyhledávání, filtrů a klienta
  const fetchEntities = useCallback(
    async (query, page = 0, pageSize = 10) => {
      setLoading(true);
      try {
        const params = {
          client_id: selectedClient,
          page: page + 1, // Stránky jsou číslovány od 1
          page_size: pageSize,
        };

        let data = null;

        if (typeof filters === "string" && filters_map[filters]) {
          data = await filters_map[filters](params); // Speciální dotaz dle filtru
        } else if (query) {
          data = await service.search(query, params); // Hledání
        } else {
          data = await service.getAll(params); // Základní dotaz
        }

        setEntities(
          Array.isArray(data.results || data) ? data.results || data : []
        );
        setRowCount(data.count || 0); // Uložení celkového počtu záznamů
      } catch (error) {
        setMessage(error?.message || `Nepodařilo se načíst ${entityName}y.`);
      } finally {
        setLoading(false);
      }
    },
    [filters, filters_map, service, selectedClient, setMessage, entityName]
  );

  // Zpožděné hledání pro optimalizaci dotazů
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(0);
      setSearch(value);
    }, 300),
    []
  );

  // Refetch při změně stránky nebo page size
  useEffect(() => {
    fetchEntities(search, page, pageSize);
  }, [page, pageSize]);

  // Případně připraveno pro budoucí změny filtrů
  useEffect(() => {}, [filters]);

  // Refetch při změně hledání
  useEffect(() => {
    if (search !== "") {
      fetchEntities(search, page, pageSize);
    }
  }, [search]);

  // První načtení po výběru klienta
  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchEntities(search, page, pageSize);
      fetchedOnce.current = true;
    }
  }, [selectedClient]);

  // Mazání položky
  const handleDelete = async (id) => {
    if (!id) {
      setMessage(`Neplatné ID pro smazání ${entityName}.`);
      return;
    }
    if (!confirm(`Opravdu chcete smazat ${entityName}?`)) return;
    setLoading(true);
    try {
      await service.delete(id);
      setEntities((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setMessage(error?.message || `Nepodařilo se smazat ${entityName}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ height: "100%" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {title}
      </Typography>

      {/* Tlačítko pro vytvoření nové položky */}
      {!noAction ? (
        <Button
          sx={{ mb: 5 }}
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push(addPath)}
        >
          Nový
        </Button>
      ) : null}

      {/* Přídavné ovládací prvky nad tabulkou */}
      {extraToolbar && <Box sx={{ mb: 2 }}>{extraToolbar}</Box>}

      {/* Hledací pole */}
      <TextField
        label={`Hledat`}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        defaultValue={search}
        onChange={(e) => debouncedSearch(e.target.value)}
      />

      {/* Datová tabulka */}
      <Box sx={{ height: "75%", width: "100%" }}>
        <DataGrid
          rows={entities}
          loading={loading}
          columns={[
            ...columns,
            ...(!noAction
              ? [
                  {
                    field: "actions",
                    headerName: "Akce",
                    flex: 1,
                    renderCell: (params) => {
                      if (!params?.row?.id) return null;
                      return (
                        <>
                          {/* Zobrazení detailu */}
                          <IconButton
                            onClick={() =>
                              router.push(`${viewPath}/${params.row.id}`)
                            }
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>

                          {/* Smazání záznamu */}
                          <IconButton
                            aria-label={`smazat ${entityName}`}
                            title={`Smazat ${entityName}`}
                            onClick={() => handleDelete(params.row.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>

                          {/* Vlastní akce definované zvenku */}
                          {rowActions &&
                            rowActions(params)?.map((action, index) => (
                              <span key={index}>{action}</span>
                            ))}
                        </>
                      );
                    },
                  },
                ]
              : []),
          ]}
          pageSizeOptions={[10, 25, 50, 100]}
          pagination
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPage(page);
            setPageSize(pageSize);
          }}
        />
      </Box>
    </Container>
  );
};

export default EntityList;
