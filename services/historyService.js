import api from "./apiClient";

const historyService = {
  // Získání veškeré historie (obecné volání bez specifikace typu)
  getAll: async (params = {}) => {
    try {
      const response = await api.get(
        `/history/`,
        { params },
        {
          withCredentials: true, // zajištění přenosu cookies
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání historie.");
    }
  },

  // Historie specifická pro operace
  getOperationHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/history/operation`,
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

  // Historie pro produkt
  getProductHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/history/product`,
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

  // Historie pro pozici
  getPositionHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/history/position`,
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

  // Historie pro šarži
  getBatchHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/history/batch`,
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

  // Historie pro skupinu
  getGroupHistory: async (params = {}) => {
    try {
      const response = await api.get(
        `/history/group`,
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

  // Fulltextové vyhledávání v historii
  search: async (query, extraParams = {}) => {
    const response = await api.get(`/history/search/`, {
      params: { q: query, ...extraParams },
    });
    return response.data;
  },
};

export default historyService;
