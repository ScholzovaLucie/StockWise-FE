import React, { useState } from "react";
import {
  Avatar,
  Stack,
  Typography,
  Menu,
  MenuItem,
  useColorScheme,
} from "@mui/material";
import { useRouter } from "next/navigation"; // nebo použij react-router-dom, pokud jsi přešel na čistý React
import { logout } from "services/authService";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

function UserInfo({ user, mode, setMode }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const userName = user?.name || "Unknown User";
  const userEmail = user?.email || "No email provided";

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("selectedClient");
    logout(); // Zavolej službu pro odhlášení (např. API request)
  };

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Stack alignItems="flex-end">
        <Typography
          sx={{ textTransform: "uppercase" }}
          fontWeight="bold"
          fontSize={18}
        >
          {userName}
        </Typography>
        <Typography lineHeight={1} fontSize={12}>
          {userEmail}
        </Typography>
      </Stack>
      <Avatar onClick={handleMenuOpen} sx={{ cursor: "pointer" }}>
        {userName.charAt(0)}
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => setMode(mode === "light" ? "dark" : "light")}>
          <Stack direction="row" spacing={2} alignItems="center">
            {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeIcon />}
            <Typography>
              {mode === "light" ? "Dark mode" : "Light mode"}
            </Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={() => router.push("/app/user")}>
          <Stack direction="row" spacing={2} alignItems="center">
            <PersonIcon />
            <Typography>User Page</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Stack direction="row" spacing={2} alignItems="center">
            <LogoutIcon />
            <Typography>Logout</Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </Stack>
  );
}

export default UserInfo;
