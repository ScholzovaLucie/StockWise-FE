import productService from "../../services/productService";
import api from "../../services/apiClient";

jest.mock("../../services/apiClient");

describe("productService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProductsByClient", () => {
    it("vrátí produkty pro daného klienta", async () => {
      const mockData = [{ id: 1, name: "Produkt 1" }];
      api.get.mockResolvedValue({ data: mockData });

      const result = await productService.getProductsByClient(123);

      expect(api.get).toHaveBeenCalledWith("/products/", {
        params: { client: 123 },
      });
      expect(result).toEqual(mockData);
    });

    it("vyhodí chybu při selhání requestu", async () => {
      api.get.mockRejectedValue(new Error("Network Error"));

      await expect(productService.getProductsByClient(123)).rejects.toThrow(
        "Nepodařilo se načíst produkty pro vybraného klienta."
      );
    });
  });

  describe("getProductStock", () => {
    it("vrátí skladovou dostupnost produktu", async () => {
      const mockStock = { available: 42 };
      api.get.mockResolvedValue({ data: mockStock });

      const result = await productService.getProductStock(456);

      expect(api.get).toHaveBeenCalledWith("/products/456/stock/");
      expect(result).toEqual(mockStock);
    });
  });
});
