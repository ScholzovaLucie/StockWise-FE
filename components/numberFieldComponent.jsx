"use client";

import React from "react";
import { TextField } from "@mui/material";

const NumberFieldComponent = ({ field, value, onChange, disabled = false }) => {
  return (
    <TextField
      fullWidth
      label={field.label}
      variant="outlined"
      name={field.name}
      disabled={disabled}
      type="number"
      value={value}
      onChange={(e) =>
        onChange({ target: { name: field.name, value: e.target.value } })
      }
      sx={{ mb: 2 }}
    />
  );
};

export default NumberFieldComponent;
