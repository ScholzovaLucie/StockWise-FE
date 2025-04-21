"use client";

import batchService from "services/batchService";
import EntityList from "components/entityList";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Tooltip } from "@mui/material";

const Products = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const columns = [
    { field: "batch_number", headerName: "Jméno", flex: 1 },
    {
      field: "product_name",
      headerName: "Produkt",
      flex: 1,
      renderCell: (params) => {
        return (
          <Button
            onClick={() =>
              router.push(`/app/products?search=${params.row.product_name}`)
            }
            color="primary"
          >
            {params.value}
          </Button>
        );
      },
    },
    { field: "expiration_date", headerName: "Expirace", flex: 1 },
  ];

  return (
    <EntityList
      title="Šarže"
      service={batchService}
      searchData={search}
      columns={columns}
      addPath="/app/batches/new"
      viewPath="/app/batches"
      entityName="batch"
    />
  );
};

export default Products;
