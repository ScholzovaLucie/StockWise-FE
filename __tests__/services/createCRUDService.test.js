import createCRUDService from "../../services/CRUDService";
import api from "../../services/apiClient";

jest.mock("../../services/apiClient", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("createCRUDService", () => {
  const endpoint = "test-endpoint";
  const service = createCRUDService(endpoint);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getAll - volá správný endpoint s parametry", async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    api.get.mockResolvedValue({ data: mockData });

    const result = await service.getAll({ page: 1 });

    expect(api.get).toHaveBeenCalledWith("/test-endpoint/", {
      params: { page: 1 },
    });
    expect(result).toEqual(mockData);
  });

  it("getById - získá záznam podle ID", async () => {
    const mockItem = { id: 123 };
    api.get.mockResolvedValue({ data: mockItem });

    const result = await service.getById(123);

    expect(api.get).toHaveBeenCalledWith("/test-endpoint/123/");
    expect(result).toEqual(mockItem);
  });

  it("create - vytvoří nový záznam", async () => {
    const input = { name: "Nový záznam" };
    const mockResponse = { id: 1, ...input };
    api.post.mockResolvedValue({ data: mockResponse });

    const result = await service.create(input);

    expect(api.post).toHaveBeenCalledWith("/test-endpoint/", input);
    expect(result).toEqual(mockResponse);
  });

  it("update - aktualizuje záznam podle ID", async () => {
    const input = { name: "Aktualizovaný záznam" };
    const mockResponse = { id: 5, ...input };
    api.put.mockResolvedValue({ data: mockResponse });

    const result = await service.update(5, input);

    expect(api.put).toHaveBeenCalledWith("/test-endpoint/5/", input);
    expect(result).toEqual(mockResponse);
  });

  it("delete - smaže záznam podle ID", async () => {
    const mockResponse = { success: true };
    api.delete.mockResolvedValue({ data: mockResponse });

    const result = await service.delete(7);

    expect(api.delete).toHaveBeenCalledWith("/test-endpoint/7/");
    expect(result).toEqual(mockResponse);
  });

  it("search - vyhledává s query a extra parametry", async () => {
    const mockResult = [{ id: 1 }];
    api.get.mockResolvedValue({ data: mockResult });

    const result = await service.search("test", { page: 2 });

    expect(api.get).toHaveBeenCalledWith("/test-endpoint/search/", {
      params: { q: "test", page: 2 },
    });
    expect(result).toEqual(mockResult);
  });
});
