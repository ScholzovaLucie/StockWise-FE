import apiClient from "./apiClient";

/**
 * Načíst všechny klienty
 * @returns {Promise<Client[]>} - Seznam klientů
 */
export const getClients = async () => {
  const response = await apiClient.get("/clients/", { withCredentials: true });
  return /** @type {Client[]} */ (response.data);
};

/**
 * Načíst jednoho klienta podle ID
 * @param {string} id - ID klienta
 * @returns {Promise<Client>} - Data klienta
 */
export const getClientById = async (id) => {
  const response = await apiClient.get(`/clients/${id}/`, {
    withCredentials: true,
  });
  return /** @type {Client} */ (response.data);
};
