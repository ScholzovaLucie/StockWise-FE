"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import historyService from "services/historyService";
import EntityList from "components/entityList";
import { IconButton, Button, Tooltip, CircularProgress } from "@mui/material";
import { useMessage } from "context/messageContext";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const History = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [columns, setColumns] = useState([]);
  const { setMessage } = useMessage();

  const [filter, setFilter] = useState("ALL");

  const extraToolbar = (
    <>
      <Button
        sx={{ mr: 2 }}
        variant={filter === "ALL" ? "contained" : "outlined"}
        onClick={() => setFilter("ALL")}
      >
        Vše
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant={filter === "PRODUCT" ? "contained" : "outlined"}
        onClick={() => setFilter("PRODUCT")}
      >
        Produkty
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant={filter === "OPERATION" ? "contained" : "outlined"}
        onClick={() => setFilter("OPERATION")}
      >
        Operace
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant={filter === "BATCH" ? "contained" : "outlined"}
        onClick={() => setFilter("BATCH")}
      >
        Šarže
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant={filter === "GROUP" ? "contained" : "outlined"}
        onClick={() => setFilter("GROUP")}
      >
        Skupina
      </Button>
      <Button
        variant={filter === "POSITION" ? "contained" : "outlined"}
        onClick={() => setFilter("POSITION")}
      >
        Pozice
      </Button>
    </>
  );

  const filterFnMap = {
    ALL: historyService.getAll,
    PRODUCT: historyService.getProductHistory,
    OPERATION: historyService.getOperationHistory,
    BATCH: historyService.getBatchHistory,
    GROUP: historyService.getGroupHistory,
    POSITION: historyService.getPositionHistory,
  };

  useEffect(() => {
    setColumns([
      { field: "type", headerName: "Typ", flex: 1 },
      { field: "description", headerName: "Popis", flex: 1 },
      { field: "timestamp", headerName: "Datum", flex: 1 },
      {
        field: "data",
        headerName: "Objekt",
        flex: 1,
      },
      { field: "user_name", headerName: "Uživatel", flex: 1 },
    ]);
  }, []);

  return columns.length === 0 ? (
    <CircularProgress size={20} />
  ) : (
    <>
      <EntityList
        title="Historie"
        service={historyService}
        searchData={search}
        columns={columns}
        viewPath="/app/history"
        entityName="history"
        noAction={true}
        extraToolbar={extraToolbar}
        filters={filter}
        filters_map={filterFnMap}
      />
    </>
  );
};

export default History;
