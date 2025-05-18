import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RecentActivityWidget from "components/widgets/recentActivityWidget";
import { useClient } from "context/clientContext";
import { getDashboardRecentActivity } from "services/dashboardService";

// Mocky
jest.mock("context/clientContext", () => ({
  useClient: jest.fn(),
}));
jest.mock("services/dashboardService", () => ({
  getDashboardRecentActivity: jest.fn(),
}));
jest.mock("react-chartjs-2", () => ({
  Line: () => <div data-testid="mock-line-chart" />,
}));

describe("RecentActivityWidget", () => {
  beforeEach(() => {
    useClient.mockReturnValue({ selectedClient: 456 });
    jest.clearAllMocks();
  });

  it("volá správný API s výchozím nastavením 'week'", async () => {
    getDashboardRecentActivity.mockResolvedValue({ chart: [], recent: [] });

    render(<RecentActivityWidget />);

    await waitFor(() => {
      expect(getDashboardRecentActivity).toHaveBeenCalledWith({
        filters: expect.objectContaining({
          type: "",
          from_date: expect.any(String),
        }),
        clientId: 456,
      });
    });
  });

  it("zobrazí pole pro vlastní datum při volbě 'custom'", async () => {
    getDashboardRecentActivity.mockResolvedValue({ chart: [], recent: [] });

    render(<RecentActivityWidget />);

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Vlastní"));

    expect(await screen.findByLabelText("Od")).toBeInTheDocument();
    expect(screen.getByLabelText("Do")).toBeInTheDocument();
  });

  it("vykreslí grafovou komponentu", async () => {
    getDashboardRecentActivity.mockResolvedValue({
      chart: [
        { date: "2024-05-01", operation: 3 },
        { date: "2024-05-02", product: 2 },
      ],
      recent: [],
    });

    render(<RecentActivityWidget />);

    expect(await screen.findByTestId("mock-line-chart")).toBeInTheDocument();
  });

  it("volá API s vlastními daty při volbě 'custom'", async () => {
    getDashboardRecentActivity.mockResolvedValue({ chart: [], recent: [] });

    render(<RecentActivityWidget />);

    // vyber "custom"
    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Vlastní"));

    const od = await screen.findByLabelText("Od");
    const doo = await screen.findByLabelText("Do");

    fireEvent.change(od, { target: { value: "2024-01-01" } });
    fireEvent.change(doo, { target: { value: "2024-01-31" } });

    await waitFor(() => {
      expect(getDashboardRecentActivity).toHaveBeenCalledWith({
        filters: {
          type: "",
          from_date: "2024-01-01",
          to_date: "2024-01-31",
        },
        clientId: 456,
      });
    });
  });
});
