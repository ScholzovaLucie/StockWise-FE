import createCRUDService from "./CRUDService";
import api from "./apiClient";

const productService = {
  // Základní CRUD operace (getAll, getById, create, update, delete, search)
  ...createCRUDService("products"),

  // Získání produktů podle ID klienta (např. pro výběr v operaci)
  getProductsByClient: async (clientId) => {
    try {
      const response = await api.get("/products/", {
        params: { client: clientId }, // filtrování podle klienta
      });
      return response.data;
    } catch (error) {
      console.error("Chyba při načítání produktů pro klienta:", error);
      throw new Error("Nepodařilo se načíst produkty pro vybraného klienta.");
    }
  },

  // Získání skladové dostupnosti (např. pro výdej zboží)
  getProductStock: async (productId) => {
    const response = await api.get(`/products/${productId}/stock/`);
    return response.data;
  },
};

export default productService;
