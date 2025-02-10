// authService.js
import api from "./apiClient";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post(
      "/auth/login/",
      { email, password },
      { withCredentials: true }
    );
    console.log("Uživatel úspěšně přihlášen:", response.data);
    return response.data;
  } catch (error) {
    console.error("Chyba při přihlašování:", error);
    throw new Error("Přihlášení se nezdařilo.");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register/", userData, {
      withCredentials: true,
    });
    console.log("Uživatel úspěšně zaregistrován:", response.data);
    return response.data;
  } catch (error) {
    console.error("Chyba při registraci:", error);
    throw new Error("Registrace se nezdařila.");
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me/", { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Token je neplatný nebo uživatel není přihlášen.");
      return null;
    }
    throw error;
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await api.post(
      "/auth/refresh/",
      {},
      { withCredentials: true }
    );
    console.log("Token obnoven:", response.data);
    return response.data.access_token;
  } catch (error) {
    console.error("Chyba při obnovování tokenu:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout/", {}, { withCredentials: true });
    console.log("Uživatel odhlášen.");
  } catch (error) {
    console.error("Chyba při odhlašování:", error);
  }
  window.location.href = "/auth";
};
