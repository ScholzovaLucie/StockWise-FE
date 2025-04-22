"use client";

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
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchData || "");
  const router = useRouter();
  const { selectedClient } = useClient();
  const { setMessage } = useMessage();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const fetchedOnce = useRef(false);

  const fetchEntities = useCallback(
    async (query, page = 0, pageSize = 10) => {
      setLoading(true);
      try {
        const params = {
          client_id: selectedClient,
          page: page + 1,
          page_size: pageSize,
        };

        let data = null;

        if (typeof filters === "string" && filters_map[filters]) {
          data = await filters_map[filters](params);
        } else if (query) {
          data = await service.search(query, params);
        } else {
          data = await service.getAll(params);
        }

        setEntities(
          Array.isArray(data.results || data) ? data.results || data : []
        );
        setRowCount(data.count || 0);
      } catch (error) {
        console.log(error);
        setMessage(error?.message || `Nepodařilo se načíst ${entityName}y.`);
      } finally {
        setLoading(false);
      }
    },
    [filters, filters_map, service, selectedClient, setMessage, entityName]
  );

  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(0);
      setSearch(value);
    }, 300),
    []
  );

  useEffect(() => {
    fetchEntities(search, page, pageSize);
  }, [page, pageSize]);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  useEffect(() => {
    if (search !== "") {
      fetchEntities(search, page, pageSize);
    }
  }, [search]);

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchEntities(search, page, pageSize);
      fetchedOnce.current = true;
    }
  }, [selectedClient]);

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
      console.log("delete");
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
      {extraToolbar && <Box sx={{ mb: 2 }}>{extraToolbar}</Box>}
      <TextField
        label={`Hledat`}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        defaultValue={search}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
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
                          <IconButton
                            onClick={() =>
                              router.push(`${viewPath}/${params.row.id}`)
                            }
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(params.row.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
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
