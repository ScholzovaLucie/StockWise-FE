import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#fca658", dark: "#f56b36" },
    secondary: { main: "#3f322e", dark: "#BC6C25" },
    background: { default: "#fff3ed", paper: "#fff3ed" },
    text: { primary: "#2F2F2F", secondary: "#5A5A5A" },
    success: { main: "#40916C" },
    warning: { main: "#F4A261" },
    error: { main: "#D72638" },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#f89371", dark: "#f89371" },
    secondary: { main: "#fcc9b8", dark: "#f89371" },
    background: { default: "#1E1E24", paper: "#2C2C34" },
    text: { primary: "#E4E4E4", secondary: "#BEBEBE" },
    iconColor: "#F4D35E",
    success: { main: "#80ED99" },
    warning: { main: "#F4D35E" },
    error: { main: "#EF233C" },
  },
});
