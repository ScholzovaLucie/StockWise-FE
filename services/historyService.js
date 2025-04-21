import api from "./apiClient";

const historyService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get(
        `/histories/`,
        { params },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání historie.");
    }
  },
  getOperationHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/histories/operation`,
        { params },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání historie.");
    }
  },
  getProductHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/histories/product`,
        { params },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání historie.");
    }
  },
  getPositionHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/histories/position`,
        { params },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání historie.");
    }
  },
  getBatchHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/histories/batch`,
        { params },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání historie.");
    }
  },
  getGroupHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/histories/group`,
        { params },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání historie.");
    }
  },
  search: async (query, extraParams = {}) => {
    const response = await api.get(`/histories/search/`, {
      params: { q: query, ...extraParams },
    });
    return response.data;
  },
};

export default historyService;
