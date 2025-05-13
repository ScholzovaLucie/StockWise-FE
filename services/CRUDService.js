import api from "./apiClient";

/**
 * Generátor základních CRUD metod pro daný endpoint.
 * Vrací objekt s metodami pro GET, POST, PUT, DELETE a vyhledávání.
 */
const createCRUDService = (endpoint) => ({
  // Získání všech záznamů (volitelně s parametry jako stránkování, filtrování apod.)
  getAll: async (params = {}) => {
    const response = await api.get(`/${endpoint}/`, { params });
    return response.data;
  },

  // Získání jednoho záznamu podle ID
  getById: async (id) => {
    const response = await api.get(`/${endpoint}/${id}/`);
    return response.data;
  },

  // Vytvoření nového záznamu
  create: async (data) => {
    const response = await api.post(`/${endpoint}/`, data);
    return response.data;
  },

  // Úplná aktualizace záznamu podle ID
  update: async (id, data) => {
    const response = await api.put(`/${endpoint}/${id}/`, data);
    return response.data;
  },

  // Smazání záznamu podle ID
  delete: async (id) => {
    const response = await api.delete(`/${endpoint}/${id}/`);
    return response.data;
  },

  // Vyhledávání dle dotazu `q` s volitelnými dalšími parametry
  search: async (query, extraParams = {}) => {
    const response = await api.get(`/${endpoint}/search/`, {
      params: { q: query, ...extraParams },
    });
    return response.data;
  },
});

export default createCRUDService;
