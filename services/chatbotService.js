import api from "./apiClient";

const chatbotService = {
  sendMessage: async (message, clientId = null) => {
    try {
      const response = await api.post("/chatbot", {
        input_chat: message,
        client: clientId,
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
};

export default chatbotService;
