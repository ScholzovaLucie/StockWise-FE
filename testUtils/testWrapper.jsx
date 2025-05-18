import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { MessageProvider } from "../context/messageContext";

const theme = createTheme({
  components: {
    MuiPopover: {
      defaultProps: {
        container: document.body,
      },
    },
    MuiModal: {
      defaultProps: {
        container: document.body,
      },
    },
  },
});

const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <MessageProvider>{children}</MessageProvider>
  </ThemeProvider>
);

export default TestWrapper;
