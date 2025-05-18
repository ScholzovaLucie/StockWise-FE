import chatbotService from "../../services/chatbotService";
import api from "../../services/apiClient";

jest.mock("../../services/apiClient");

describe("chatbotService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendMessage", () => {
    it("odešle zprávu bez souboru a vrátí odpověď", async () => {
      const mockData = { reply: "odpověď" };
      api.post.mockResolvedValue({ data: mockData });

      const result = await chatbotService.sendMessage("Ahoj", 1);

      expect(api.post).toHaveBeenCalled();
      const [url, formData, config] = api.post.mock.calls[0];
      expect(url).toBe("/chatbot");
      expect(formData instanceof FormData).toBe(true);
      expect(config.headers["Content-Type"]).toBe("multipart/form-data");
      expect(result).toEqual(mockData);
    });

    it("odešle zprávu se souborem", async () => {
      const mockData = { reply: "OK" };
      const file = new File(["test"], "test.csv", { type: "text/csv" });
      api.post.mockResolvedValue({ data: mockData });

      const result = await chatbotService.sendMessage("Zpráva", 1, file);

      expect(api.post).toHaveBeenCalled();
      const [_, formData] = api.post.mock.calls[0];
      expect(formData.get("file")).toBe(file);
      expect(result).toEqual(mockData);
    });

    it("vyhodí fallback chybu při selhání", async () => {
      api.post.mockRejectedValue({
        response: { data: { content: "Chyba z backendu" } },
      });

      await expect(chatbotService.sendMessage("fail")).rejects.toThrow(
        "Chyba z backendu"
      );
    });

    it("vyhodí obecnou chybu při neznámé chybě", async () => {
      api.post.mockRejectedValue(new Error("Síťová chyba"));

      await expect(chatbotService.sendMessage("fail")).rejects.toThrow(
        "Omlouvám se, ale momentálně nemohu odpovědět."
      );
    });
  });

  describe("getHistory", () => {
    it("vrátí historii", async () => {
      const mockData = [{ message: "Hello" }];
      api.post.mockResolvedValue({ data: mockData });

      const result = await chatbotService.getHistory(1);

      expect(api.post).toHaveBeenCalledWith("/chatbot", {
        history: true,
        client: 1,
      });
      expect(result).toEqual(mockData);
    });

    it("zachytí chybu při načítání historie", async () => {
      api.post.mockRejectedValue({
        response: { data: { content: "Chyba historie" } },
      });

      await expect(chatbotService.getHistory()).rejects.toThrow(
        "Chyba historie"
      );
    });
  });

  describe("resetChat", () => {
    it("úspěšně resetuje chat", async () => {
      api.post.mockResolvedValue({});

      await chatbotService.resetChat(1);

      expect(api.post).toHaveBeenCalledWith("/chatbot", {
        reset: true,
        client: 1,
      });
    });

    it("zachytí chybu při resetování", async () => {
      api.post.mockRejectedValue({
        response: { data: { content: "Reset chyba" } },
      });

      await expect(chatbotService.resetChat()).rejects.toThrow("Reset chyba");
    });
  });

  describe("getStat", () => {
    it("vrátí data pro statistiku", async () => {
      const mockData = { type: "bar", data: [1, 2] };
      api.post.mockResolvedValue({ data: mockData });

      const result = await chatbotService.getStat("stat-123", 5);

      expect(api.post).toHaveBeenCalledWith("/statistics", {
        stat_id: "stat-123",
        client: 5,
      });
      expect(result).toEqual(mockData);
    });

    it("zachytí chybu při načítání statistik", async () => {
      api.post.mockRejectedValue({
        response: { data: { content: "Statistika chyba" } },
      });

      await expect(chatbotService.getStat("x", 1)).rejects.toThrow(
        "Statistika chyba"
      );
    });
  });
});
