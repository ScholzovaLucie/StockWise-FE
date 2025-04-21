import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#fca658", dark: "#f56b36" }, // Tlumená šedozelená
    secondary: { main: "#3f322e", dark: "#BC6C25" }, // Přírodní béžová s teplým podtónem
    background: { default: "#fff3ed", paper: "#fff3ed" }, // Teplá bílá s jemným šedým podtónem
    text: { primary: "#2F2F2F", secondary: "#5A5A5A" }, // Uhlově černá pro výbornou čitelnost
    success: { main: "#40916C" }, // Moderní tlumená zelená
    warning: { main: "#F4A261" }, // Světlejší oranžová
    error: { main: "#D72638" }, // Mírně tmavší červená
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#f89371", dark: "#f89371" },
    secondary: { main: "#fcc9b8", dark: "#f89371" },
    background: { default: "#1E1E24", paper: "#2C2C34" },
    text: { primary: "#E4E4E4", secondary: "#BEBEBE" },
    iconColor: "#F4D35E", // Jasná žlutá pro zvýraznění ikon
    success: { main: "#80ED99" },
    warning: { main: "#F4D35E" },
    error: { main: "#EF233C" },
  },
});
