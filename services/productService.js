import apiClient from "./apiClient";

/**
 * Načíst všechny produkty
 * @returns {Promise<Product[]>} - Seznam produktů
 */
export const getProducts = async () => {
  const response = await apiClient.get("/products/", { withCredentials: true });
  return /** @type {Product[]} */ (response.data);
};

/**
 * Načíst jeden produkt podle ID
 * @param {string} id - ID produktu
 * @returns {Promise<Product>} - Data produktu
 */
export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}/`, {
    withCredentials: true,
  });
  return /** @type {Product} */ (response.data);
};

/**
 * Vytvořit nový produkt
 * @param {Partial<Product>} productData - Data pro nový produkt
 * @returns {Promise<Product>} - Vytvořený produkt
 */
export const createProduct = async (productData) => {
  const response = await apiClient.post("/products/", productData, {
    withCredentials: true,
  });
  return /** @type {Product} */ (response.data);
};
