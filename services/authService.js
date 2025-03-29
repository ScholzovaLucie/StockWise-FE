import api from "./apiClient";
import Cookies from "js-cookie";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post(
      "/auth/login/",
      { email, password },
      { withCredentials: true } // Zajistí přenos cookies
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Přihlášení se nezdařilo.");
  }
};

export const registerUser = async (email, password) => {
  try {
    const response = await api.post(
      "/auth/register/",
      { email, password },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Registrace se nezdařila.");
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me/", {
      withCredentials: true, // Backend pošle uživatelská data v odpovědi
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await api.post(
      "/auth/refresh/",
      {},
      { withCredentials: true }
    );
    return response.data.access_token;
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout/", {}, { withCredentials: true });
  } catch (error) {}
  window.location.href = "/auth/login";
};

export const changePassword = async (
  old_password,
  new_password,
  confirm_password
) => {
  try {
    const response = await api.post(
      "/auth/change-password/",
      { old_password, new_password, confirm_password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Změna hesla se nezdařila.");
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post(
      "/auth/request-password-reset/",
      { email },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        "Nepodařilo se odeslat e-mail pro reset hesla."
    );
  }
};

export const resetPassword = async (token, new_password, confirm_password) => {
  try {
    const response = await api.post(
      "/auth/reset-password/",
      { token, new_password, confirm_password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Nepodařilo se změnit heslo."
    );
  }
};
