import api from "./apiClient";

const userService = {
  // Získání dat jednoho uživatele podle ID
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Načtení uživatele se nezdařilo."
      );
    }
  },

  // Aktualizace uživatele podle ID
  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Aktualizace se nezdařila."
      );
    }
  },
};

export default userService;
