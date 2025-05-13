"use client";

import productService from "services/productService";
import EntityList from "components/entityList";
import { Button, Tooltip, IconButton } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const Products = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Použití hooku pro získání query parametrů
  const search = searchParams.get("search");

  const rowActions = useCallback(
    (params) => [
      <IconButton
        key="history"
        onClick={() => router.push(`history/product/${params.row.id}`)}
        color="info"
      >
        <HistoryIcon />
      </IconButton>,
    ],
    [router]
  );

  const columns = [
    { field: "sku", headerName: "SKU", width: 120 },
    { field: "name", headerName: "Název", flex: 1 },
    { field: "description", headerName: "Popis", flex: 1 },
    { field: "amount_cached", headerName: "Množství", width: 100 },
    {
      field: "groups",
      headerName: "Skupiny",
      width: 100,
      renderCell: (params) => {
        const { groups } = params.row || {};
        return groups ? (
          <Tooltip title={groups.title || ""}>
            <Button
              onClick={() =>
                router.push(`/app/groups?search=${groups.search || ""}`)
              }
              color="primary"
            >
              {groups.count || 0}
            </Button>
          </Tooltip>
        ) : null;
      },
    },
    {
      field: "batches",
      headerName: "Šarže",
      width: 100,
      renderCell: (params) => {
        const { batches } = params.row || {};
        return batches ? (
          <Tooltip title={batches.search}>
            <Button
              onClick={() => {
                router.push(`/app/batches?search=${batches.search}`);
              }}
              color="primary"
            >
              {params.row.batches.count}
            </Button>
          </Tooltip>
        ) : null;
      },
    },
  ];

  return (
    <EntityList
      title="Skladové položky"
      service={productService}
      columns={columns}
      searchData={search}
      addPath="/app/products/new"
      viewPath="/app/products"
      entityName="produkt"
      rowActions={rowActions}
    />
  );
};

export default Products;
