import { getDashboardOverview } from "/services/dashboardService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useClient } from "/context/clientContext";

const OverviewWidget = () => {
  const [overview, setOverview] = useState(null);
  const router = useRouter();
  const { selectedClient } = useClient();

  useEffect(() => {
    getDashboardOverview({ clientId: selectedClient })
      .then((data) => setOverview(data))
      .catch((err) => console.error(err));
  }, [selectedClient]);

  if (!overview) {
    return <Typography>Načítám data...</Typography>;
  }

  const items = [
    {
      icon: <InventoryIcon color="primary" />,
      label: "Celkový počet produktů",
      value: overview.totalProducts,
    },
    {
      icon: <WarehouseIcon color="secondary" />,
      label: "Celkový počet kusů",
      value: overview.totalItems,
    },
    {
      icon: <WarningAmberIcon sx={{ color: "orange" }} />,
      label: "Produkty s blížící se expirací",
      value: overview.expiringSoonCount.count,
      link: `/app/batches?search=${overview.expiringSoonCount.data}`,
    },
    {
      icon: <ArrowDownwardIcon sx={{ color: "red" }} />,
      label: "Produkty s nízkou zásobou",
      value: overview.lowStockCount.count,
      link: `/app/products?search=${overview.lowStockCount.data}`,
    },
    {
      icon: <RemoveShoppingCartIcon sx={{ color: "red" }} />,
      label: "Nezaskladněné produkty",
      value: overview.outOfStockProducts.count,
      link: `/app/products?search=${overview.outOfStockProducts.data}`,
    },
    {
      icon: <ArrowUpwardIcon sx={{ color: "green" }} />,
      label: "Nejzásobenější produkt",
      value: `${overview.mostStockedProduct?.name || 0} (${overview.mostStockedProduct?.amount || 0})`,
      link: `/app/products?search=${overview.mostStockedProduct?.name}`,
    },
  ];

  return (
    <Box
      sx={{
        overflow: "auto",
        height: "90%",
        p: 2,
        display: "grid",
        gap: 1,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        alignItems: "center",
      }}
    >
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            m: 1,
            borderRadius: 2,
            boxShadow: 1,
            p: 1,
            "&:hover": {
              backgroundColor: item.link ? "#f5f5f5" : "transparent",
            },
            cursor: item.link ? "pointer" : "default",
          }}
          onClick={() => item.link && router.push(item.link)}
        >
          {item.icon}
          <Typography>
            {item.label}:{" "}
            <span style={{ fontWeight: "bold" }}>{item.value}</span>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default OverviewWidget;
