import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EntityDetail from "../../components/entityDetail";
import { useParams, useRouter } from "next/navigation";
import TestWrapper from "../../testUtils/testWrapper";

// Mocky
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

const mockService = {
  getById: jest.fn(),
  update: jest.fn(),
};

// Ukázková konfigurace polí
const fields = [
  { name: "name", label: "Název", type: "text" },
  { name: "price", label: "Cena", type: "number" },
];
const selectFields = [
  {
    name: "category",
    label: "Kategorie",
    options: [
      { id: 1, name: "Kategorie A" },
      { id: 2, name: "Kategorie B" },
    ],
  },
];

// Helper
const renderComponent = () =>
  render(
    <TestWrapper>
      <EntityDetail
        title="Detail entity"
        service={mockService}
        fields={fields}
        selectFields={selectFields}
        redirectPath="/app/entities"
      />
    </TestWrapper>
  );

describe("EntityDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: "123" });

    mockService.getById.mockResolvedValue({
      id: "123",
      name: "Testovací entita",
      price: 42,
      category: 1,
    });

    mockService.update.mockResolvedValue({});
  });

  it("zobrazí LoadingScreen při načítání", async () => {
    renderComponent();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );
  });

  it("zobrazí data po načtení", async () => {
    renderComponent();
    expect(
      await screen.findByDisplayValue("Testovací entita")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("42")).toBeInTheDocument();
  });

  it("přepne do editačního režimu", async () => {
    renderComponent();
    const editButton = await screen.findByRole("button", { name: "Upravit" });

    fireEvent.click(editButton);

    const input = screen.getByLabelText("Název");
    expect(input).not.toBeDisabled();
  });

  it("uloží změny", async () => {
    renderComponent();
    fireEvent.click(await screen.findByText("Upravit"));

    const nameInput = screen.getByLabelText("Název");
    fireEvent.change(nameInput, { target: { value: "Aktualizovaný název" } });

    const saveButton = screen.getByText("Uložit změny");
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockService.update).toHaveBeenCalledWith("123", {
        name: "Aktualizovaný název",
        price: 42,
        category: 1,
      })
    );
  });

  it("zobrazí chybu při selhání načtení", async () => {
    mockService.getById.mockRejectedValueOnce(new Error("Chyba načítání"));
    renderComponent();

    expect(
      await screen.findByText(/entita nebyla nalezena/i)
    ).toBeInTheDocument();
  });
});
