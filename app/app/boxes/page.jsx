"use client";

import boxService from "/services/boxService";
import EntityList from "/components/entityList";
import { useRouter , useSearchParams} from "next/navigation";
import { Button, Tooltip } from "@mui/material";

const Boxes = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Použití hooku pro získání query parametrů
  const search = searchParams.get("search");


  const columns = [
    { field: "ean", headerName: "EAN", width: 100 },
    { field: "width", headerName: "Width", flex: 1 },
    { field: "height", headerName: "Height", flex: 1 },
    { field: "depth", headerName: "Depth", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
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
      field: "position",
      headerName: "Posice",
      width: 150,
      renderCell: (params) => {
        return(
        <Button
          onClick={() => router.push(`/app/positions?search=${params.row.position}`)}
          color="primary"
        >
          {params.row.position}
        </Button>
      )},
    },
  ];

  return (
    <EntityList
      title="Krabice"
      service={boxService}
      searchData={search}
      columns={columns}
      addPath="/app/boxes/new"
      viewPath="/app/boxes"
      entityName="box"
    />
  );
};

export default Boxes;