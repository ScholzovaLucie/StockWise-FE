import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import HistoryTimeline from "components/HistoryTimeline";
import historyService from "services/historyService";
import operationService from "services/operationService";

// Mockování služeb
jest.mock("services/historyService");
jest.mock("services/operationService");

describe("HistoryTimeline", () => {
  const mockHistory = [
    {
      id: 1,
      type: "operation",
      timestamp: "2023-05-01T10:00:00Z",
      description: "Změna stavu operace",
      user: { username: "admin" },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("zobrazí loader při načítání", async () => {
    historyService.getOperationHistory.mockResolvedValueOnce({ results: [] });
    operationService.getById.mockResolvedValueOnce({ number: "OP123" });

    render(<HistoryTimeline type="operation" relatedId={1} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("zobrazí nadpis a časovou osu pro operaci", async () => {
    historyService.getOperationHistory.mockResolvedValueOnce({
      results: mockHistory,
    });
    operationService.getById.mockResolvedValueOnce({ number: "OP123" });

    render(<HistoryTimeline type="operation" relatedId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Historie operace: OP123/)).toBeInTheDocument();
      expect(screen.getByText("Změna stavu operace")).toBeInTheDocument();
      expect(screen.getByText(/Uživatel: admin/)).toBeInTheDocument();
    });
  });

  it("ošetří případ bez výsledků", async () => {
    historyService.getOperationHistory.mockResolvedValueOnce({ results: [] });
    operationService.getById.mockResolvedValueOnce({ number: "OP123" });

    render(<HistoryTimeline type="operation" relatedId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Historie operace: OP123/)).toBeInTheDocument();
    });
  });
});
