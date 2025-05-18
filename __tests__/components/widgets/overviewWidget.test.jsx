import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import OverviewWidget from "components/widgets/overviewWidget";
import { useClient } from "context/clientContext";
import { useRouter } from "next/navigation";
import * as dashboardService from "services/dashboardService";

// Mocky
jest.mock("context/clientContext", () => ({
  useClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("services/dashboardService", () => ({
  getDashboardOverview: jest.fn(),
}));

describe("OverviewWidget", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useClient.mockReturnValue({ selectedClient: 123 });
    useRouter.mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("zobrazí loading text při čekání na data", () => {
    dashboardService.getDashboardOverview.mockResolvedValue(null);
    render(<OverviewWidget />);
    expect(screen.getByText("Načítám data...")).toBeInTheDocument();
  });

  it("vykreslí všechny položky z přehledu", async () => {
    dashboardService.getDashboardOverview.mockResolvedValue({
      totalProducts: 20,
      totalItems: 300,
      expiringSoonCount: { count: 5, data: "expiring" },
      lowStockCount: { count: 3, data: "low" },
      outOfStockProducts: { count: 2, data: "missing" },
      mostStockedProduct: { name: "Jablka", amount: 150 },
    });

    render(<OverviewWidget />);

    await waitFor(() => {
      expect(screen.getByText(/Celkový počet produktů:/)).toBeInTheDocument();
      expect(screen.getByText(/300/)).toBeInTheDocument();
      expect(screen.getByText(/Nejzásobenější produkt/)).toHaveTextContent(
        "Jablka (150)"
      );
    });
  });

  it("naviguje po kliknutí na odkazovanou položku", async () => {
    dashboardService.getDashboardOverview.mockResolvedValue({
      totalProducts: 20,
      totalItems: 300,
      expiringSoonCount: { count: 5, data: "expiring" },
      lowStockCount: { count: 3, data: "low" },
      outOfStockProducts: { count: 2, data: "missing" },
      mostStockedProduct: { name: "Jablka", amount: 150 },
    });

    render(<OverviewWidget />);

    const clickableBox = await screen.findByText(/Nejzásobenější produkt/);
    fireEvent.click(clickableBox);

    expect(mockPush).toHaveBeenCalledWith("/app/products?search=Jablka");
  });

  it("volá dashboardService s ID klienta", async () => {
    dashboardService.getDashboardOverview.mockResolvedValue({
      totalProducts: 0,
      totalItems: 0,
      expiringSoonCount: { count: 0, data: "" },
      lowStockCount: { count: 0, data: "" },
      outOfStockProducts: { count: 0, data: "" },
      mostStockedProduct: null,
    });

    render(<OverviewWidget />);

    await waitFor(() => {
      expect(dashboardService.getDashboardOverview).toHaveBeenCalledWith({
        clientId: 123,
      });
    });
  });
});
