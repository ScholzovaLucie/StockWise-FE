import api from "./apiClient";

const chatbotService = {
  // Odeslání zprávy chatbotovi (volitelně s klientem a souborem)
  sendMessage: async (message, clientId = null, file = null) => {
    try {
      const formData = new FormData();
      formData.append("input_chat", message);
      formData.append("client", clientId);
      if (file) {
        formData.append("file", file); // Přiložený soubor (např. Excel/CSV)
      }

      const response = await api.post("/chatbot", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // důležité pro soubory
        },
      });

      return response.data;
    } catch (error) {
      console.error("Chyba při komunikaci s chatbotem:", error);
      throw new Error(
        error.response?.data?.content ||
          "Omlouvám se, ale momentálně nemohu odpovědět."
      );
    }
  },

  // Získání historie chatu (volitelně pro konkrétního klienta)
  getHistory: async (clientId = null) => {
    try {
      const response = await api.post("/chatbot", {
        history: true,
        client: clientId,
      });
      return response.data;
    } catch (error) {
      console.error("Chyba při načítání historie chatu:", error);
      throw new Error(
        error.response?.data?.content || "Chyba při načítání historie chatu."
      );
    }
  },

  // Resetování chatu – smazání vlákna (např. po přepnutí klienta)
  resetChat: async (clientId = null) => {
    try {
      await api.post("/chatbot", { reset: true, client: clientId });
    } catch (error) {
      console.error("Chyba při resetování chatu:", error);
      throw new Error(
        error.response?.data?.content || "Chyba při resetování chatu."
      );
    }
  },

  // Získání dat statistiky (např. graf nebo text) na základě ID a klienta
  getStat: async (statId, clientId) => {
    try {
      const response = await api.post("/statistics", {
        stat_id: statId,
        client: clientId,
      });
      return response.data;
    } catch (error) {
      console.error("Chyba při získávání statistiky:", error);
      throw new Error(
        error.response?.data?.content || "Nepodařilo se načíst statistiku."
      );
    }
  },
};

export default chatbotService;
