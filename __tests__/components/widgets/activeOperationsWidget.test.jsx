import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ActiveOperationsWidget from "components/widgets/activeOperationsWidget";
import { useClient } from "context/clientContext";
import { useRouter } from "next/navigation";
import * as dashboardService from "services/dashboardService";

// Mock kontext a router
jest.mock("context/clientContext", () => ({
  useClient: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("services/dashboardService", () => ({
  getDashboardActiveOperations: jest.fn(),
}));

describe("ActiveOperationsWidget", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useClient.mockReturnValue({ selectedClient: 123 });
    useRouter.mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("zobrazí zprávu, pokud nejsou aktivní operace", async () => {
    dashboardService.getDashboardActiveOperations.mockResolvedValue([]);

    render(<ActiveOperationsWidget />);

    await waitFor(() =>
      expect(screen.getByText("Žádné aktivní operace.")).toBeInTheDocument()
    );
  });

  it("vykreslí aktivní operace", async () => {
    dashboardService.getDashboardActiveOperations.mockResolvedValue([
      { id: 1, number: "OP001", type: "IN", status: "COMPLETED" },
      { id: 2, number: "OP002", type: "OUT", status: "BOX" },
    ]);

    render(<ActiveOperationsWidget />);

    await waitFor(() => {
      expect(
        screen.getByText((_, element) => {
          return element?.textContent === "Číslo: OP001";
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText((_, element) => {
          return element?.textContent === "Číslo: OP002";
        })
      ).toBeInTheDocument();
    });
  });

  it("naviguje na detail operace po kliknutí", async () => {
    dashboardService.getDashboardActiveOperations.mockResolvedValue([
      { id: 3, number: "OP003", type: "MOVE", status: "CANCELLED" },
    ]);

    render(<ActiveOperationsWidget />);

    const operation = await screen.findByText(
      (_, element) => element?.textContent === "Číslo: OP003"
    );

    fireEvent.click(operation);

    expect(mockPush).toHaveBeenCalledWith("/app/operations?search=OP003");
  });

  it("volá dashboardService s ID klienta", async () => {
    dashboardService.getDashboardActiveOperations.mockResolvedValue([]);

    render(<ActiveOperationsWidget />);

    await waitFor(() => {
      expect(
        dashboardService.getDashboardActiveOperations
      ).toHaveBeenCalledWith({
        clientId: 123,
      });
    });
  });
});
