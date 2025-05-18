import * as dashboardService from "../../services/dashboardService";
import apiClient from "../../services/apiClient";

jest.mock("../../services/apiClient");

const clientId = 42;
const mockResponse = { data: "ok" };

describe("dashboardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getDashboardOverview", async () => {
    apiClient.get.mockResolvedValue(mockResponse);
    const result = await dashboardService.getDashboardOverview({ clientId });
    expect(apiClient.get).toHaveBeenCalledWith("/dashboard/overview/", {
      params: { clientId },
      withCredentials: true,
    });
    expect(result).toBe("ok");
  });

  it("getDashboardAlerts", async () => {
    apiClient.get.mockResolvedValue(mockResponse);
    const result = await dashboardService.getDashboardAlerts({ clientId });
    expect(apiClient.get).toHaveBeenCalledWith("/dashboard/alerts/", {
      params: { clientId },
      withCredentials: true,
    });
    expect(result).toBe("ok");
  });

  it("getDashboardLowStock", async () => {
    apiClient.get.mockResolvedValue(mockResponse);
    const result = await dashboardService.getDashboardLowStock({ clientId });
    expect(apiClient.get).toHaveBeenCalledWith("/dashboard/low_stock/", {
      params: { clientId },
      withCredentials: true,
    });
    expect(result).toBe("ok");
  });

  it("getDashboardRecentActivity", async () => {
    apiClient.get.mockResolvedValue(mockResponse);
    const filters = { type: "IN", period: "7d" };
    const result = await dashboardService.getDashboardRecentActivity({
      clientId,
      filters,
    });
    expect(apiClient.get).toHaveBeenCalledWith("/dashboard/recent_activity/", {
      params: { clientId, filters },
      withCredentials: true,
    });
    expect(result).toBe("ok");
  });

  it("getDashboardActiveOperations", async () => {
    apiClient.get.mockResolvedValue(mockResponse);
    const result = await dashboardService.getDashboardActiveOperations({
      clientId,
    });
    expect(apiClient.get).toHaveBeenCalledWith(
      "/dashboard/active_operations/",
      {
        params: { clientId },
        withCredentials: true,
      }
    );
    expect(result).toBe("ok");
  });

  it("getDashboardStats", async () => {
    apiClient.get.mockResolvedValue(mockResponse);
    const filters = { period: "30d" };
    const result = await dashboardService.getDashboardStats({
      clientId,
      filters,
    });
    expect(apiClient.get).toHaveBeenCalledWith("/dashboard/stats/", {
      params: { clientId, filters },
      withCredentials: true,
    });
    expect(result).toBe("ok");
  });

  it("getDashboardEfficiency", async () => {
    apiClient.get.mockResolvedValue(mockResponse);
    const result = await dashboardService.getDashboardEfficiency({ clientId });
    expect(apiClient.get).toHaveBeenCalledWith("/dashboard/efficiency/", {
      params: { clientId },
      withCredentials: true,
    });
    expect(result).toBe("ok");
  });

  it("getDashboardExtendedStats", async () => {
    apiClient.get.mockResolvedValue(mockResponse);
    const result = await dashboardService.getDashboardExtendedStats({
      clientId,
    });
    expect(apiClient.get).toHaveBeenCalledWith("/dashboard/extended_stats/", {
      params: { clientId },
      withCredentials: true,
    });
    expect(result).toBe("ok");
  });

  it("getUserWidgets", async () => {
    apiClient.get.mockResolvedValue(mockResponse);
    const result = await dashboardService.getUserWidgets(true);
    expect(apiClient.get).toHaveBeenCalledWith(
      "/dashboard/my_widgets/",
      {
        params: { stats: true },
      },
      { withCredentials: true }
    );
    expect(result).toBe("ok");
  });

  it("saveUserWidgets", async () => {
    apiClient.post.mockResolvedValue(mockResponse);
    const widgets = [{ name: "Widget1" }];
    const result = await dashboardService.saveUserWidgets(widgets, false);
    expect(apiClient.post).toHaveBeenCalledWith(
      "/dashboard/save_widgets/",
      { widgets, stats: false },
      { withCredentials: true }
    );
    expect(result).toBe("ok");
  });

  // Příklad testu chybového stavu
  it("getDashboardOverview - error", async () => {
    apiClient.get.mockRejectedValue(new Error("Network error"));
    await expect(
      dashboardService.getDashboardOverview({ clientId })
    ).rejects.toThrow("Network error");
  });
});
