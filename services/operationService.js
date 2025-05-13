import api from "./apiClient";

const operationService = {
  // Získání všech operací (včetně parametrů jako filtrování, stránkování)
  getAll: async (params = {}) => {
    const response = await api.get(`/operations/all/`, { params });
    return response.data;
  },

  // Získání jedné operace podle ID
  getById: async (id) => {
    const response = await api.get(`/operations/${id}/`);
    return response.data;
  },

  // Vytvoření operace (používá se jen u některých variant)
  create: async (data) => {
    const response = await api.post(`/operations/`, data);
    return response.data;
  },

  // Úplná aktualizace operace (PUT)
  update: async (id, data) => {
    const response = await api.put(`/operations/${id}/`, data);
    return response.data;
  },

  // Smazání operace – přesměrováno na vlastní endpoint `/remove/`
  delete: async (id) => {
    const response = await api.delete(`/operations/${id}/remove/`);
    return response.data;
  },

  // Vyhledávání operací dle dotazu a volitelných parametrů
  search: async (query, extraParams = {}) => {
    const response = await api.get(`/operations/search/`, {
      params: { q: query, ...extraParams },
    });
    return response.data;
  },

  // Načtení seznamu všech možných statusů (např. "Připraveno", "Zabalené" atd.)
  getStatuses: async () => {
    try {
      const response = await api.get("/operations/statuses");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Chyba při načítání statusů operací."
      );
    }
  },

  // Načtení všech možných typů operací (např. "IN", "OUT")
  getTypes: async () => {
    try {
      const response = await api.get("/operations/types");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Chyba při načítání typů operací."
      );
    }
  },

  // Přidání produktu do krabice v rámci operace
  addToBox: async (id, selectedBox, productId, quantityToAdd) => {
    const response = await api.post(
      `/operations/${id}/add_to_box/`,
      {
        box_id: selectedBox,
        product_id: productId,
        quantity: quantityToAdd,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  // Získání přehledu produktů v rámci dané operace (např. pro balení)
  getOperationProductSummary: async (operationId) => {
    try {
      const response = await api.get(
        `/operations/${operationId}/product_summary/`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Chyba při dokončení operace."
      );
    }
  },

  // Dokončení balení operace – uzavření stavu
  completeOperation: async (operationId) => {
    try {
      const response = await api.post(
        `/operations/${operationId}/complete_packing/`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Chyba při dokončení operace."
      );
    }
  },

  // Změna statusu operace (např. ručně z dashboardu)
  updateOperationStatus: async (operationId, newStatus) => {
    try {
      const response = await api.patch(
        `/operations/${operationId}/update_status/`,
        { status: newStatus },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Chyba při změně statusu."
      );
    }
  },

  // Spuštění procesu balení (např. označení jako 'zabalit')
  startPackaging: async (id) => {
    const response = await api.post(`/operations/${id}/start_packaging/`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Vytvoření nové operace (modernější metoda)
  createOperation: async (operationData) => {
    try {
      const response = await api.post("/operations/create/", operationData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Chyba při vytváření operace."
      );
    }
  },

  // Aktualizace existující operace (modernější metoda)
  updateOperation: async (operationId, operationData) => {
    try {
      const response = await api.patch(
        `/operations/${operationId}/update/`,
        operationData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Chyba při ukládání operace."
      );
    }
  },
};

export default operationService;
