import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ExtendedStatsWidget from "components/widgets/extendedStatsWidget";
import { useClient } from "context/clientContext";
import * as dashboardService from "services/dashboardService";

// Mocks
jest.mock("context/clientContext", () => ({
  useClient: jest.fn(),
}));
jest.mock("services/dashboardService", () => ({
  getDashboardExtendedStats: jest.fn(),
}));

// Mockuj Chart.js komponentu, protože Line je složitá na testování
jest.mock("react-chartjs-2", () => ({
  Line: () => <div data-testid="mock-line-chart" />,
}));

describe("ExtendedStatsWidget", () => {
  beforeEach(() => {
    useClient.mockReturnValue({ selectedClient: 123 });
    jest.clearAllMocks();
  });

  it("zobrazí loading stav při načítání", async () => {
    dashboardService.getDashboardExtendedStats.mockReturnValue(
      new Promise(() => {})
    );

    render(<ExtendedStatsWidget />);
    expect(
      screen.getByText("Načítám rozšířené statistiky...")
    ).toBeInTheDocument();
  });

  it("vykreslí data a graf", async () => {
    dashboardService.getDashboardExtendedStats.mockResolvedValue({
      avgCompletionTime: 12.345,
      trend: [
        { day: "2024-05-01", user__name: "Alice", count: 5 },
        { day: "2024-05-02", user__name: "Alice", count: 3 },
        { day: "2024-05-01", user__name: "Bob", count: 2 },
      ],
    });

    render(<ExtendedStatsWidget />);

    await waitFor(() => {
      expect(
        screen.getByText(/Průměrná doba dokončení: 12.35 minut/)
      ).toBeInTheDocument();
      expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
    });
  });

  it("volá getDashboardExtendedStats s ID klienta", async () => {
    dashboardService.getDashboardExtendedStats.mockResolvedValue({
      avgCompletionTime: 0,
      trend: [],
    });

    render(<ExtendedStatsWidget />);

    await waitFor(() => {
      expect(dashboardService.getDashboardExtendedStats).toHaveBeenCalledWith({
        clientId: 123,
      });
    });
  });
});
