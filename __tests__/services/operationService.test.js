import operationService from "../../services/operationService";
import api from "../../services/apiClient";

jest.mock("../../services/apiClient");

describe("operationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockData = { data: "ok" };

  it("getAll zavolá správný endpoint s parametry", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await operationService.getAll({ page: 1 });
    expect(api.get).toHaveBeenCalledWith("/operations/all/", {
      params: { page: 1 },
    });
    expect(result).toEqual(mockData);
  });

  it("getById načte operaci podle ID", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await operationService.getById(5);
    expect(api.get).toHaveBeenCalledWith("/operations/5/");
    expect(result).toEqual(mockData);
  });

  it("create vytvoří operaci", async () => {
    api.post.mockResolvedValue({ data: mockData });
    const result = await operationService.create({ name: "Op1" });
    expect(api.post).toHaveBeenCalledWith("/operations/", { name: "Op1" });
    expect(result).toEqual(mockData);
  });

  it("update pošle PUT požadavek", async () => {
    api.put.mockResolvedValue({ data: mockData });
    const result = await operationService.update(7, { status: "new" });
    expect(api.put).toHaveBeenCalledWith("/operations/7/", { status: "new" });
    expect(result).toEqual(mockData);
  });

  it("delete volá správný endpoint", async () => {
    api.delete.mockResolvedValue({ data: mockData });
    const result = await operationService.delete(3);
    expect(api.delete).toHaveBeenCalledWith("/operations/3/remove/");
    expect(result).toEqual(mockData);
  });

  it("search volá správný endpoint s query", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await operationService.search("hledat", { page: 2 });
    expect(api.get).toHaveBeenCalledWith("/operations/search/", {
      params: { q: "hledat", page: 2 },
    });
    expect(result).toEqual(mockData);
  });

  it("getStatuses vrací statusy nebo vyhazuje výjimku", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await operationService.getStatuses();
    expect(api.get).toHaveBeenCalledWith("/operations/statuses");
    expect(result).toEqual(mockData);

    api.get.mockRejectedValue({ response: { data: { error: "chyba" } } });
    await expect(operationService.getStatuses()).rejects.toThrow("chyba");
  });

  it("getTypes vrací typy nebo vyhazuje výjimku", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await operationService.getTypes();
    expect(api.get).toHaveBeenCalledWith("/operations/types");
    expect(result).toEqual(mockData);

    api.get.mockRejectedValue({ response: { data: { error: "chyba typu" } } });
    await expect(operationService.getTypes()).rejects.toThrow("chyba typu");
  });

  it("addToBox zavolá správný endpoint", async () => {
    api.post.mockResolvedValue({ data: mockData });
    const result = await operationService.addToBox(1, 2, 3, 4);
    expect(api.post).toHaveBeenCalledWith(
      "/operations/1/add_to_box/",
      {
        box_id: 2,
        product_id: 3,
        quantity: 4,
      },
      { withCredentials: true }
    );
    expect(result).toEqual(mockData);
  });

  it("completeOperation zavolá správný endpoint nebo hodí chybu", async () => {
    api.post.mockResolvedValue({ data: mockData });
    const result = await operationService.completeOperation(4);
    expect(api.post).toHaveBeenCalledWith(
      "/operations/4/complete_packing/",
      {},
      { withCredentials: true }
    );
    expect(result).toEqual(mockData);

    api.post.mockRejectedValue({ response: { data: { error: "chyba" } } });
    await expect(operationService.completeOperation(4)).rejects.toThrow(
      "chyba"
    );
  });

  it("getOperationProductSummary vrací přehled nebo chybu", async () => {
    api.get.mockResolvedValue({ data: mockData });
    const result = await operationService.getOperationProductSummary(99);
    expect(api.get).toHaveBeenCalledWith("/operations/99/product_summary/");
    expect(result).toEqual(mockData);

    api.get.mockRejectedValue({
      response: { data: { error: "chyba souhrnu" } },
    });
    await expect(
      operationService.getOperationProductSummary(99)
    ).rejects.toThrow("chyba souhrnu");
  });

  it("updateOperationStatus odešle PATCH požadavek", async () => {
    api.patch.mockResolvedValue({ data: mockData });
    const result = await operationService.updateOperationStatus(10, "DONE");
    expect(api.patch).toHaveBeenCalledWith(
      "/operations/10/update_status/",
      { status: "DONE" },
      { withCredentials: true }
    );
    expect(result).toEqual(mockData);

    api.patch.mockRejectedValue({
      response: { data: { error: "chyba změny" } },
    });
    await expect(
      operationService.updateOperationStatus(10, "DONE")
    ).rejects.toThrow("chyba změny");
  });

  it("startPackaging zavolá správný endpoint", async () => {
    api.post.mockResolvedValue({ data: mockData });
    const result = await operationService.startPackaging(11);
    expect(api.post).toHaveBeenCalledWith("/operations/11/start_packaging/", {
      withCredentials: true,
    });
    expect(result).toEqual(mockData);
  });

  it("createOperation odešle data a vrátí odpověď", async () => {
    api.post.mockResolvedValue({ data: mockData });
    const result = await operationService.createOperation({ foo: "bar" });
    expect(api.post).toHaveBeenCalledWith(
      "/operations/create/",
      { foo: "bar" },
      {
        withCredentials: true,
      }
    );
    expect(result).toEqual(mockData);

    api.post.mockRejectedValue({
      response: { data: { error: "Chyba při vytváření" } },
    });
    await expect(operationService.createOperation({})).rejects.toThrow(
      "Chyba při vytváření"
    );
  });

  it("updateOperation odešle PATCH a vrátí odpověď", async () => {
    api.patch.mockResolvedValue({ data: mockData });
    const result = await operationService.updateOperation(12, { bar: "baz" });
    expect(api.patch).toHaveBeenCalledWith(
      "/operations/12/update/",
      { bar: "baz" },
      {
        withCredentials: true,
      }
    );
    expect(result).toEqual(mockData);

    api.patch.mockRejectedValue({
      response: { data: { error: "Chyba uložení" } },
    });
    await expect(operationService.updateOperation(12, {})).rejects.toThrow(
      "Chyba uložení"
    );
  });
});
