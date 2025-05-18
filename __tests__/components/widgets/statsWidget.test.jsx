import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import StatsWidget from "components/statsWidget";
import { useClient } from "context/clientContext";
import chatbotService from "services/chatbotService";
import STAT_LABELS from "/constants";

// Mocky
jest.mock("context/clientContext", () => ({
  useClient: jest.fn(),
}));

jest.mock("services/chatbotService", () => ({
  getStat: jest.fn(),
}));

jest.mock("components/markdownRenderer", () => ({ content }) => (
  <div data-testid="markdown">{content}</div>
));

jest.mock("/constants", () => ({
  test_stat: "Testovací statistika",
}));

describe("StatsWidget", () => {
  const onRemove = jest.fn();

  beforeEach(() => {
    useClient.mockReturnValue({ selectedClient: "123" });
    jest.clearAllMocks();
  });

  it("zobrazí loading spinner a načte obrázek", async () => {
    chatbotService.getStat.mockResolvedValueOnce({
      element: "img",
      src: "https://example.com/chart.png",
      alt: "Graf",
    });

    render(<StatsWidget id="test_stat" onRemove={onRemove} />);

    // Loading spinner by měl být viditelný
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Po načtení se zobrazí obrázek
    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "https://example.com/chart.png");
      expect(img).toHaveAttribute("alt", "Graf");
    });

    // Nadpis by měl být podle STAT_LABELS
    expect(screen.getByText("Testovací statistika")).toBeInTheDocument();
  });

  it("zobrazí fallback text při chybě", async () => {
    chatbotService.getStat.mockRejectedValueOnce(new Error("API chyba"));

    render(<StatsWidget id="test_stat" onRemove={onRemove} />);

    await waitFor(() => {
      expect(screen.getByTestId("markdown")).toHaveTextContent(
        "Nepodařilo se načíst data."
      );
    });
  });

  it("spustí onRemove při kliknutí na tlačítko", async () => {
    chatbotService.getStat.mockResolvedValueOnce({
      element: "p",
      content: "Statistika text",
    });

    render(<StatsWidget id="test_stat" onRemove={onRemove} />);

    await waitFor(() =>
      expect(screen.getByTestId("markdown")).toBeInTheDocument()
    );

    const deleteBtn = screen.getByLabelText(/smazat widget/i);
    deleteBtn.click();

    expect(onRemove).toHaveBeenCalledWith("test_stat");
  });
});
