"use client";

import positionService from "/services/positionService";
import EntityList from "/components/entityList";
import { Button, Tooltip } from "@mui/material";
import { useRouter , useSearchParams} from "next/navigation";

const Positions = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Použití hooku pro získání query parametrů
  const search = searchParams.get("search");

  const columns = [
    { field: "code", headerName: "Code", flex: 1 },
    {
      field: "boxes",
      headerName: "Krabice",
      width: 100,
      renderCell: (params) => {
        return(
        <Tooltip title={params.row.boxes.search}>
          <Button
            onClick={() => {
              router.push(`/app/operations?search=${params.row.boxes.search}`)}}
            color="primary"
          >
            {params.row.boxes.count}
          </Button>
        </Tooltip>
      )},
    },
    {
      field: "warehouse_name",
      headerName: "Sklad",
      flex: 1,
      renderCell: (params) => {
        return(
        <Button
          onClick={() => router.push(`/app/warehouse?search=${params.row.warehouse_name}`)}
          color="primary"
        >
          {params.row.warehouse_name}
        </Button>
      )},
    },
  ];

  return (
    <EntityList
      title="Pozice"
      service={positionService}
      columns={columns}
      addPath="/app/positions/new"
      viewPath="/app/positions"
      entityName="position"
    />
  );
};

export default Positions;