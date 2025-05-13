import api from "./apiClient";
import createCRUDService from "./CRUDService";

// Vytvoření služby pro práci s krabicemi (boxy)
const boxService = {
  // Základní CRUD metody z předdefinovaného generátoru
  ...createCRUDService("boxes"),

  // Získání produktů obsažených v konkrétní krabici
  getProductsInBox: async (boxId) => {
    try {
      const response = await api.get(`/boxes/${boxId}/products/`, {
        withCredentials: true, // nutné pro přenos cookies (autentizace)
      });
      return response.data;
    } catch (error) {
      throw new Error("Chyba při načítání produktů v krabici."); // obecná chybová hláška
    }
  },
};

export default boxService;
