import api from "./apiClient";
import Cookies from "js-cookie";

// Přihlášení uživatele – vrací data nebo vyhazuje chybu
export const loginUser = async (email, password) => {
  try {
    const response = await api.post(
      "/auth/login/",
      { email, password },
      { withCredentials: true } // zajistí přenos cookies
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Přihlášení se nezdařilo.");
  }
};

// Registrace uživatele
export const registerUser = async (email, password) => {
  try {
    const response = await api.post(
      "/auth/register/",
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Registrace se nezdařila.");
  }
};

// Získání aktuálně přihlášeného uživatele
export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me/", {
      withCredentials: true, // cookies musí být součástí požadavku
    });
    return response.data;
  } catch (error) {
    return null; // při chybě vrací null (nepřihlášený uživatel)
  }
};

// Odhlášení uživatele a přesměrování na login
export const logout = async () => {
  try {
    await api.post("/auth/logout/", {}, { withCredentials: true });
  } catch (error) {
    // chybu ignorujeme, i kdyby už byl uživatel odhlášen
  }
  window.location.href = "/auth/login"; // přesměrování na přihlášení
};

// Změna hesla uživatele
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

// Požadavek na reset hesla (odeslání e-mailu s tokenem)
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

// Resetování hesla pomocí tokenu z e-mailu
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
