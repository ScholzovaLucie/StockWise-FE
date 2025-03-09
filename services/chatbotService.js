import api from "./apiClient";

const chatbotService = {
  sendMessage: async (message) => {
    try {
      const response = await api.post("/chat/", { message });
      return response.data.response;
    } catch (error) {
      console.error("Chyba při komunikaci s chatbotem:", error);
      return "Omlouvám se, ale momentálně nemohu odpovědět.";
    }
  },
};

export default chatbotService;
