"use client";

import { TextField } from "@mui/material";

const DateFieldComponent = ({ field, value, onChange, disabled = false }) => {
    return (
      <TextField
        fullWidth
        label={field.label}
        variant="outlined"
        name={field.name}
        type="date"
        disabled={disabled}
        value={value}
        onChange={onChange}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
    );
  };

  export default DateFieldComponent;
  