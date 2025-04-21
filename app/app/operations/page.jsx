"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import operationService from "/services/operationService";
import EntityList from "/components/entityList";
import StatusDropdown from "/components/statusDropdown";
import { IconButton, Button, Tooltip, CircularProgress } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import HistoryIcon from "@mui/icons-material/History";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useMessage } from "/context/messageContext";

const Operations = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [statuses, setStatuses] = useState([]);
  const [columns, setColumns] = useState([]);
  const { setMessage } = useMessage();

  // ✅ Použití useCallback pro zabránění zbytečnému renderování
  const fetchStatuses = useCallback(async () => {
    try {
      const response = await operationService.getStatuses();
      setStatuses(response.data); // Odebráno `.data`, protože služba vrací přímo `response.data`
    } catch (error) {
      setMessage(`Chyba při načítání statusů: ${error.message}`);
    }
  }, [setMessage]);

  // ✅ Načítání statusů při prvním renderu
  useEffect(() => {
    fetchStatuses();
  }, []);

  useEffect(() => {
    setColumns([
      {
        field: "",
        headerName: "",
        width: 50,
        renderCell: (params) =>
          params.row.type === "OUT" ? (
            <ArrowUpwardIcon sx={{ color: "red", alignSelf: "center" }} />
          ) : params.row.type === "IN" ? (
            <ArrowDownwardIcon sx={{ color: "green", alignSelf: "center" }} />
          ) : null,
      },
      { field: "number", headerName: "Číslo", flex: 1 },
      { field: "description", headerName: "Popis", flex: 1 },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => (
          <StatusDropdown
            operationId={params.row.id}
            currentStatus={params.value}
            statuses={statuses}
          />
        ),
      },
      { field: "type", headerName: "Typ", width: 80 },
      {
        field: "groups_amount",
        headerName: "Groups",
        width: 100,
        renderCell: (params) => (
          <Tooltip title={params.row.groups_name}>
            <Button
              onClick={() =>
                router.push(`/app/groups?search=${params.row.groups_search}`)
              }
              color="primary"
            >
              {params.row.groups_amount}
            </Button>
          </Tooltip>
        ),
      },
      {
        field: "product_amount",
        headerName: "Products",
        width: 100,
        renderCell: (params) => (
          <Tooltip title={params.row.product_search}>
            <Button
              onClick={() =>
                router.push(`/app/products?search=${params.row.product_search}`)
              }
              color="primary"
            >
              {params.row.product_amount}
            </Button>
          </Tooltip>
        ),
      },
    ]);
  }, [statuses]);

  const rowActions = useCallback(
    (params) => [
      <IconButton
        key="view"
        onClick={() => router.push(`/app/operations/${params.row.id}/packing`)}
        color="primary"
      >
        <InventoryIcon />
      </IconButton>,
      <IconButton
        key="history"
        onClick={() => router.push(`history/operation/${params.row.id}`)}
        color="info"
      >
        <HistoryIcon />
      </IconButton>,
    ],
    [router]
  );

  return statuses.length === 0 || columns.length === 0 ? (
    <CircularProgress size={20} />
  ) : (
    <>
      <EntityList
        title="Operace"
        service={operationService}
        searchData={search}
        columns={columns}
        rowActions={rowActions}
        addPath="/app/operations/new"
        viewPath="/app/operations"
        entityName="operation"
      />
    </>
  );
};

export default Operations;
