import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3A86FF", dark: "#1A66CC" },
    secondary: { main: "#FFBE0B", dark: "#E99600" },
    background: { default: "#F4F4F4", paper: "#E0E0E0" },
    text: { primary: "#323232", secondary: "#40444B" },
    success: { main: "#06D6A0" },
    warning: { main: "#FFD166" },
    error: { main: "#EF476F" },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1A66CC" },
    secondary: { main: "#E99600" },
    background: { default: "#202225", paper: "#40444B" },
    text: { primary: "#D1D1D1", secondary: "#A0A0A0" },
    success: { main: "#06D6A0" },
    warning: { main: "#FFD166" },
    error: { main: "#EF476F" },
  },
});
