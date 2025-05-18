import historyService from "../../services/historyService";
import api from "../../services/apiClient";

jest.mock("../../services/apiClient");

const mockData = [{ id: 1, action: "updated" }];
const params = { clientId: 1 };

describe("historyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const endpoints = [
    { name: "getAll", path: "/history/" },
    { name: "getOperationHistory", path: "/history/operation" },
    { name: "getProductHistory", path: "/history/product" },
    { name: "getPositionHistory", path: "/history/position" },
    { name: "getBatchHistory", path: "/history/batch" },
    { name: "getGroupHistory", path: "/history/group" },
  ];

  endpoints.forEach(({ name, path }) => {
    it(`${name} volá správný endpoint a vrací data`, async () => {
      api.get.mockResolvedValue({ data: mockData });

      const result = await historyService[name](params);

      expect(api.get).toHaveBeenCalledWith(
        path,
        { params },
        { withCredentials: true }
      );
      expect(result).toEqual(mockData);
    });

    it(`${name} vyhazuje chybu při selhání requestu`, async () => {
      api.get.mockRejectedValue(new Error("Síťová chyba"));

      await expect(historyService[name](params)).rejects.toThrow(
        "Chyba při načítání historie."
      );
    });
  });

  describe("search", () => {
    it("volá správný endpoint s query parametrem", async () => {
      const query = "produkt";
      const extraParams = { clientId: 1 };
      api.get.mockResolvedValue({ data: mockData });

      const result = await historyService.search(query, extraParams);

      expect(api.get).toHaveBeenCalledWith("/history/search/", {
        params: { q: query, ...extraParams },
      });
      expect(result).toEqual(mockData);
    });

    it("vyhazuje chybu, pokud search selže", async () => {
      api.get.mockRejectedValue(new Error("Chyba při hledání"));

      await expect(historyService.search("něco")).rejects.toThrow(
        "Chyba při hledání"
      );
    });
  });
});
