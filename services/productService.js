import createCRUDService from "./CRUDService";
import api from "./apiClient";

const productService = {
  ...createCRUDService("products"),

  // Získání produktů podle ID klienta
  getProductsByClient: async (clientId) => {
    try {
      const response = await api.get("/products/", {
        params: { client: clientId },
      });
      return response.data;
    } catch (error) {
      console.error("Chyba při načítání produktů pro klienta:", error);
      throw new Error("Nepodařilo se načíst produkty pro vybraného klienta.");
    }
  },

  // Získání skladové dostupnosti
  getProductStock: async (productId) => {
    const response = await api.get(`/products/${productId}/stock/`);
    return response.data;
  },
};

export default productService;
