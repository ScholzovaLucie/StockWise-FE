"use client";

import groupService from "services/groupService";
import EntityList from "components/entityList";
import { Button, Tooltip } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const Groups = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Použití hooku pro získání query parametrů
  const search = searchParams.get("search");

  const columns = [
    { field: "name", headerName: "Jméno", flex: 1 },
    { field: "quantity", headerName: "Množství", flex: 1 },
    {
      field: "box_ean",
      headerName: "Krabice",
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            onClick={() =>
              router.push(`/app/boxes?search=${params.row.box_ean}`)
            }
            color="primary"
          >
            {params.value}
          </Button>
        );
      },
    },
    {
      field: "product_name",
      headerName: "Produkt",
      width: 100,
      renderCell: (params) => {
        return (
          <Button
            onClick={() =>
              router.push(`/app/products?search=${params.row.product_name}`)
            }
            color="primary"
          >
            {params.row.product_name}
          </Button>
        );
      },
    },
    {
      field: "operations_in",
      headerName: "Příjemky",
      width: 120,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.operations_in.search}>
            <Button
              onClick={() => {
                router.push(
                  `/app/operations?search=${params.row.operations_in.search}`
                );
              }}
              color="primary"
              startIcon={<ArrowDownwardIcon sx={{ color: "green" }} />} // 📥 Příjemka (zelená šipka dolů)
            >
              {params.row.operations_in.count}
            </Button>
          </Tooltip>
        );
      },
    },
    {
      field: "operations_out",
      headerName: "Výdejky",
      width: 120,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.operations_out.search}>
            <Button
              onClick={() => {
                router.push(
                  `/app/operations?search=${params.row.operations_out.search}`
                );
              }}
              color="primary"
              startIcon={<ArrowUpwardIcon sx={{ color: "red" }} />} // 📤 Výdejka (červená šipka nahoru)
            >
              {params.row.operations_out.count}
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <EntityList
      title="Skupina"
      service={groupService}
      searchData={search}
      columns={columns}
      addPath="/app/groups/new"
      viewPath="/app/groups"
      entityName="group"
    />
  );
};

export default Groups;
