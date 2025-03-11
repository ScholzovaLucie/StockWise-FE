import api from "./apiClient";
import createCRUDService from "./CRUDService";

const boxService = {
  ...createCRUDService("boxes"),

  getProductsInBox: async (boxId) => {
    try {
      const response = await api.get(`/boxes/${boxId}/products/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání produktů v krabici.");
    }
  },
};

export default boxService;
