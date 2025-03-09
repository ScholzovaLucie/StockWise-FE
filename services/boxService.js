import createCRUDService from "./CRUDService";

const boxService = {
  ...createCRUDService("box"),

  getProductsInBox: async (boxId) => {
    try {
      const response = await apiClient.get(`/boxes/${boxId}/products/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání produktů v krabici.");
    }
  },
};

export default boxService;
