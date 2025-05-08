import api from "./apiClient";

const operationService = {
  getAll: async (params = {}) => {
    const response = await api.get(`/operations/all/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/operations/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`/operations/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/operations/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/operations/${id}/remove/`);
    return response.data;
  },

  search: async (query, extraParams = {}) => {
    const response = await api.get(`/operations/search/`, {
      params: { q: query, ...extraParams },
    });
    return response.data;
  },

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
  addToBox: async (operationId, boxId, productId, quantity) => {
    try {
      const response = await api.post(
        `/operations/${operationId}/add_to_box/`,
        { box_id: boxId, product_id: productId, quantity: quantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          "Chyba při přidávání produktu do krabice."
      );
    }
  },

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

  startPackaging: async (id) => {
    const response = await api.post(`/operations/${id}/start_packaging/`, {
      withCredentials: true,
    });
    return response.data;
  },

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
