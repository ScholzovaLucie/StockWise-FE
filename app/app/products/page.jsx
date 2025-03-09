"use client";

import productService from "/services/productService";
import EntityList from "/components/entityList";
import { Button, Tooltip } from "@mui/material";
import { useRouter , useSearchParams} from "next/navigation";


const Products = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Použití hooku pro získání query parametrů
  const search = searchParams.get("search");
  
  const columns = [
    { field: "sku", headerName: "SKU", width: 120 },
    { field: "name", headerName: "Název", flex: 1 },
    { field: "description", headerName: "Popis", flex: 1 },
    { field: "amount", headerName: "Množství", width: 100,},
    {
      field: "groups",
      headerName: "Skupiny",
      width: 100,
      renderCell: (params) => {
        return(
          <Tooltip title={params.row.groups.title}>
        <Button
          onClick={() => {
            router.push(`/app/groups?search=${params.row.groups.search}`)}}
          color="primary"
        >
          {params.row.groups.count}
        </Button>
        </Tooltip>
      )},
    },
    {
      field: "batches",
      headerName: "Šarže",
      width: 100,
      renderCell: (params) => {
        return(
          <Tooltip title={params.row.batches.search}>
        <Button
          onClick={() => {
            router.push(`/app/batches?search=${params.row.batches.search}`)}}
          color="primary"
        >
          {params.row.batches.count}
        </Button>
        </Tooltip>
      )},
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
    />
  );
};

export default Products;