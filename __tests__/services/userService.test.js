import userService from "../../services/userService";
import api from "../../services/apiClient";

jest.mock("../../services/apiClient");

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("vrátí data uživatele při úspěchu", async () => {
      const mockUser = { id: 1, name: "Alice" };
      api.get.mockResolvedValue({ data: mockUser });

      const result = await userService.getUser(1);

      expect(api.get).toHaveBeenCalledWith("/users/1/");
      expect(result).toEqual(mockUser);
    });

    it("vyhodí specifickou chybu při chybové odpovědi", async () => {
      api.get.mockRejectedValue({
        response: { data: { error: "Uživatel nenalezen" } },
      });

      await expect(userService.getUser(99)).rejects.toThrow(
        "Uživatel nenalezen"
      );
    });

    it("vyhodí fallback chybu při jiné chybě", async () => {
      api.get.mockRejectedValue(new Error("Síťová chyba"));

      await expect(userService.getUser(99)).rejects.toThrow(
        "Načtení uživatele se nezdařilo."
      );
    });
  });

  describe("updateUser", () => {
    it("aktualizuje uživatele a vrátí nová data", async () => {
      const mockUser = { id: 1, name: "Bob" };
      api.put.mockResolvedValue({ data: mockUser });

      const result = await userService.updateUser(1, { name: "Bob" });

      expect(api.put).toHaveBeenCalledWith("/users/1/", { name: "Bob" });
      expect(result).toEqual(mockUser);
    });

    it("vyhodí specifickou chybu při chybové odpovědi", async () => {
      api.put.mockRejectedValue({
        response: { data: { error: "Neplatná data" } },
      });

      await expect(userService.updateUser(1, {})).rejects.toThrow(
        "Neplatná data"
      );
    });

    it("vyhodí fallback chybu při jiné chybě", async () => {
      api.put.mockRejectedValue(new Error("Síťová chyba"));

      await expect(userService.updateUser(1, {})).rejects.toThrow(
        "Aktualizace se nezdařila."
      );
    });
  });
});
