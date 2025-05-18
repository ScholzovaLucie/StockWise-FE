import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EfficiencyWidget from "components/widgets/efficiencyWidget";
import { useClient } from "context/clientContext";
import * as dashboardService from "services/dashboardService";

// Mocks
jest.mock("context/clientContext", () => ({
  useClient: jest.fn(),
}));
jest.mock("services/dashboardService", () => ({
  getDashboardEfficiency: jest.fn(),
}));

describe("EfficiencyWidget", () => {
  beforeEach(() => {
    useClient.mockReturnValue({ selectedClient: 123 });
    jest.clearAllMocks();
  });

  it("zobrazí loading stav, pokud nejsou data", async () => {
    dashboardService.getDashboardEfficiency.mockReturnValue(
      new Promise(() => {})
    );

    render(<EfficiencyWidget />);

    expect(screen.getByText("Načítám data...")).toBeInTheDocument();
  });

  it("vykreslí data po načtení", async () => {
    dashboardService.getDashboardEfficiency.mockResolvedValue({
      efficiency: 82.345,
      weeklyEfficiency: 75.123,
      avgEfficiency: 69.876,
    });

    render(<EfficiencyWidget />);

    await waitFor(() => {
      expect(screen.getByText("82.3%")).toBeInTheDocument();
      expect(screen.getByText(/Tento týden:/)).toBeInTheDocument();
      expect(screen.getByText(/75.1%/)).toBeInTheDocument();
      expect(screen.getByText(/69.9%/)).toBeInTheDocument();
    });
  });

  it("volá dashboardService s ID klienta", async () => {
    dashboardService.getDashboardEfficiency.mockResolvedValue({
      efficiency: 60,
      weeklyEfficiency: 55,
      avgEfficiency: 50,
    });

    render(<EfficiencyWidget />);

    await waitFor(() => {
      expect(dashboardService.getDashboardEfficiency).toHaveBeenCalledWith({
        clientId: 123,
      });
    });
  });
});
