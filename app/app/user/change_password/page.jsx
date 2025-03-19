"use client";

import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { changePassword } from "services/authService";
import { useMessage } from "/context/messageContext";

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { message, setMessage } = useMessage();

  const passwordsMatch = newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setMessage("Nová hesla se neshodují.");
      return;
    }

    try {
      const response = await changePassword(
        oldPassword,
        newPassword,
        confirmPassword
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error?.error || "Něco se pokazilo.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" gutterBottom>
        Změna hesla
      </Typography>

      <TextField
        label="Staré heslo"
        type="password"
        fullWidth
        required
        margin="normal"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <TextField
        label="Nové heslo"
        type="password"
        fullWidth
        required
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={!passwordsMatch && confirmPassword.length > 0}
        helperText={
          !passwordsMatch && confirmPassword.length > 0
            ? "Nová hesla se neshodují."
            : ""
        }
      />
      <TextField
        label="Potvrzení nového hesla"
        type="password"
        fullWidth
        required
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!passwordsMatch && confirmPassword.length > 0}
        helperText={
          !passwordsMatch && confirmPassword.length > 0
            ? "Nová hesla se neshodují."
            : ""
        }
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={!passwordsMatch || !newPassword}
      >
        Změnit heslo
      </Button>
    </Box>
  );
};

export default ChangePasswordForm;
