"use client";

import React from "react";
import { TextField } from "@mui/material";

// Komponenta pro textové pole
const TextFieldComponent = ({ field, value, onChange, disabled = false }) => {
  return (
    <TextField
      fullWidth
      label={field.label}
      variant="outlined"
      name={field.name || "undefined"}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      multiline={field.multiline || false}
      minRows={field.minRows || 1}
      sx={{ mb: 2 }}
    />
  );
};

export default TextFieldComponent;
