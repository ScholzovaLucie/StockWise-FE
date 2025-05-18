import boxService from "../../services/boxService";
import api from "../../services/apiClient";

jest.mock("../../services/apiClient");

describe("boxService", () => {
  describe("getProductsInBox", () => {
    const boxId = 123;

    it("vrátí produkty v krabici při úspěšném požadavku", async () => {
      const mockData = [
        { id: 1, name: "Produkt A" },
        { id: 2, name: "Produkt B" },
      ];
      api.get.mockResolvedValue({ data: mockData });

      const result = await boxService.getProductsInBox(boxId);

      expect(api.get).toHaveBeenCalledWith(`/boxes/${boxId}/products/`, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });

    it("vyhodí chybu při neúspěšném požadavku", async () => {
      api.get.mockRejectedValue(new Error("Network error"));

      await expect(boxService.getProductsInBox(boxId)).rejects.toThrow(
        "Chyba při načítání produktů v krabici."
      );
    });
  });
});
