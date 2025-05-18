"use client";

import React from "react";
import { Stack } from "@mui/material";
import UserInfo from "components/userInfo";
import { useAuth } from "context/authContext";

function UserSection({ mode, setMode }) {
  const { user, logout } = useAuth();

  return (
    <Stack direction="row" spacing={0} alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center">
        <UserInfo user={user} logout={logout} mode={mode} setMode={setMode} />
      </Stack>
    </Stack>
  );
}

export default UserSection;
