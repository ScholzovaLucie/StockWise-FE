import api from "./apiClient";

const createCRUDService = (endpoint) => ({
  getAll: async (params = {}) => {
    const response = await api.get(`/${endpoint}/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/${endpoint}/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`/${endpoint}/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/${endpoint}/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/${endpoint}/${id}/`);
    return response.data;
  },

  search: async (query, extraParams = {}) => {
    const response = await api.get(`/${endpoint}/search/`, {
      params: { q: query, ...extraParams },
    });
    return response.data;
  },
});

export default createCRUDService;
