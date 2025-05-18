import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import LowStockWidget from "../../../components/widgets/LowStockWidget";
import { getDashboardLowStock } from "../../../services/dashboardService";
import { useClient } from "../../../context/clientContext";
import userEvent from "@testing-library/user-event";

// Mock služeb
jest.mock("../../../services/dashboardService", () => ({
  getDashboardLowStock: jest.fn(),
}));

jest.mock("../../../context/clientContext", () => ({
  useClient: jest.fn(),
}));

// Definuj push funkci uvnitř mocku, s prefixem "mock" – to Jest dovolí
jest.mock("next/navigation", () => {
  const mockPush = jest.fn();
  return {
    useRouter: () => ({ push: mockPush }),
    __mockPush: mockPush,
  };
});

describe("LowStockWidget", () => {
  const mockClientId = "test-client";

  beforeEach(() => {
    jest.clearAllMocks();
    useClient.mockReturnValue({
      selectedClient: mockClientId,
    });
  });

  it("zobrazí zprávu, pokud nejsou žádné produkty s nízkým množstvím", async () => {
    getDashboardLowStock.mockResolvedValue([]);

    render(<LowStockWidget />);

    await waitFor(() =>
      expect(
        screen.getByText("Všechny produkty mají dostatečné zásoby.")
      ).toBeInTheDocument()
    );
  });

  it("zobrazí produkty s nízkým množstvím", async () => {
    getDashboardLowStock.mockResolvedValue([
      { name: "Banán", amount_cached: 3 },
      { name: "Jablko", amount_cached: 7 },
    ]);

    render(<LowStockWidget />);

    await waitFor(() => {
      expect(screen.getByText("Banán")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("Jablko")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });
  });

  it("po kliknutí na produkt přesměruje na stránku s filtrem", async () => {
    getDashboardLowStock.mockResolvedValue([
      { name: "Pomeranč", amount_cached: 1 },
    ]);

    const navigation = jest.requireMock("next/navigation");

    render(<LowStockWidget />);

    await waitFor(() => {
      const item = screen.getByText("Pomeranč");
      userEvent.click(item);
    });

    await waitFor(() => {
      expect(navigation.__mockPush).toHaveBeenCalledWith(
        "/app/products?search=Pomeranč"
      );
    });
  });

  it("zachytí chybu při načítání dat", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    getDashboardLowStock.mockRejectedValue(new Error("Chyba načítání"));

    render(<LowStockWidget />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
