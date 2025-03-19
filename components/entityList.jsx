"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Box,
  Typography,
  CircularProgress,
  Container,
  IconButton,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import debounce from "lodash.debounce";
import { useClient } from "/context/clientContext";
import { useMessage } from "/context/messageContext";

const EntityList = ({
  title,
  service,
  columns,
  searchData,
  addPath,
  viewPath,
  entityName = "položka",
  rowActions,
}) => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchData || "");
  const router = useRouter();
  const { selectedClient } = useClient();
  const { setMessage } = useMessage();

  // ✅ Efektivnější debounce search (pouze 300ms)
  const handleSearch = useCallback(
    debounce(async (query) => {
      setLoading(true);
      try {
        const data = query
          ? await service.search(query)
          : await service.getAll({ client_id: selectedClient });
        setEntities(Array.isArray(data) ? data : []);
      } catch (error) {
        setMessage(error?.message || `Nepodařilo se vyhledat ${entityName}y.`);
      } finally {
        setLoading(false);
      }
    }, 300),
    [selectedClient, service, entityName]
  );

  useEffect(() => {
    handleSearch(search);
  }, [search, selectedClient]);

  // ✅ Zajistí, že searchData se synchronizuje správně
  useEffect(() => {
    if (searchData !== undefined && searchData !== search) {
      setSearch(searchData);
    }
  }, [searchData]);

  // ✅ Oprava handleDelete, aby se předešlo chybě
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

  if (!entities && loading) {
  }

  if (entities) {
    return (
      <Container sx={{ height: "100%" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Button
          sx={{ mb: 5 }}
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push(addPath)}
        >
          Nový {entityName}
        </Button>
        <TextField
          label={`Hledat ${entityName}`}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Box sx={{ height: "75%", width: "100%" }}>
            <DataGrid
              rows={entities}
              columns={[
                ...columns,
                {
                  field: "actions",
                  headerName: "Akce",
                  width: 150,
                  renderCell: (params) => {
                    if (!params.row?.id) return null;
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
              ]}
            />
          </Box>
        )}
      </Container>
    );
  }
};

export default EntityList;
