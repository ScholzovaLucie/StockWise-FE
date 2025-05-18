import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import OperationForm from "../../components/createOperation";
import clientServiceDefault from "../../services/clientService";
import productService from "../../services/productService";
import operationService from "../../services/operationService";
import { MessageProvider, useMessage } from "../../context/messageContext";

// Mocky
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../services/productService", () => ({
  getProductsByClient: jest.fn(),
  getProductStock: jest.fn(),
}));
jest.mock("../../services/operationService", () => ({
  createOperation: jest.fn(),
  updateOperation: jest.fn(),
  getById: jest.fn(),
}));

jest.mock("../../services/clientService", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));

// Pomocná komponenta pro zobrazení zprávy
const MessageDisplay = () => {
  const { message } = useMessage();
  return message ? <div role="alert">{message}</div> : null;
};

// Render s providerem a zobrazovačem zprávy
const renderWithProviders = (ui) => {
  return render(
    <MessageProvider>
      {ui}
      <MessageDisplay />
    </MessageProvider>
  );
};

describe("OperationForm", () => {
  beforeEach(() => {
    clientServiceDefault.getAll.mockResolvedValue({
      results: [
        { id: 1, name: "Klient A" },
        { id: 2, name: "Klient B" },
      ],
    });

    productService.getProductsByClient.mockResolvedValue([
      { id: 101, name: "Produkt X" },
      { id: 102, name: "Produkt Y" },
    ]);

    productService.getProductStock.mockResolvedValue({ available: 50 });
  });

  it("zobrazí chybu při pokusu o uložení bez vyplnění polí", async () => {
    renderWithProviders(<OperationForm />);
    const ulozitBtn = await screen.findByRole("button", {
      name: "Vytvořit Operaci",
    });

    fireEvent.click(ulozitBtn);

    await waitFor(() => {
      const alerts = screen.queryAllByRole("alert");
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0]).toHaveTextContent(/vyplňte všechny povinné/i);
    });
  });

  it("umožní výběr klienta", async () => {
    renderWithProviders(<OperationForm />);
    const klientSelect = await screen.findByLabelText("Klient");

    await act(async () => {
      fireEvent.mouseDown(screen.getByLabelText("Klient"));
    });

    await waitFor(() => {
      expect(screen.getByText("Klient A")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Klient A"));

    expect(klientSelect).toHaveTextContent("Klient A");
  });

  it("přidá produkt po kliknutí", async () => {
    renderWithProviders(<OperationForm />);

    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );

    const klientSelect = screen.getByLabelText("Klient");
    await act(async () => {
      fireEvent.mouseDown(screen.getByLabelText("Klient"));
    });

    await waitFor(() => {
      expect(screen.getByText("Klient A")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Klient A"));

    const pridatBtn = await screen.findByText("Přidat produkt");
    fireEvent.click(pridatBtn);

    expect(await screen.findByLabelText("Produkt")).toBeInTheDocument();
  });
});
