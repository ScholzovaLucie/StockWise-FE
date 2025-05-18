import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewEntityForm from "components/newEntityForm";
import { useRouter } from "next/navigation";
import { useMessage } from "context/messageContext";

// Mock router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock context
jest.mock("context/messageContext", () => ({
  useMessage: jest.fn(),
}));

describe("NewEntityForm", () => {
  const push = jest.fn();
  const setMessage = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push });
    useMessage.mockReturnValue({ setMessage, message: "" });
  });

  const service = {
    create: jest.fn(),
  };

  const fields = [
    { name: "name", label: "Název", type: "text" },
    { name: "quantity", label: "Množství", type: "number" },
  ];

  const selectFields = [
    {
      name: "category",
      label: "Kategorie",
      multiple: false,
      options: [
        { id: "1", name: "A" },
        { id: "2", name: "B" },
      ],
    },
  ];

  it("zobrazí formulář a umožní vyplnění a odeslání", async () => {
    render(
      <NewEntityForm
        title="Nový produkt"
        fields={fields}
        selectFields={selectFields}
        service={service}
        redirectPath="/produkty"
      />
    );

    // Vyplnění textového pole
    fireEvent.change(screen.getByLabelText(/Název/i), {
      target: { value: "Testovací produkt", name: "name" },
    });

    // Vyplnění číselného pole
    fireEvent.change(screen.getByLabelText(/Množství/i), {
      target: { value: 5, name: "quantity" },
    });

    // Vybrání kategorie
    fireEvent.mouseDown(screen.getByLabelText(/Kategorie/i));
    fireEvent.click(await screen.findByText("A"));

    // Odeslání formuláře
    fireEvent.click(screen.getByRole("button", { name: /Vytvořit/i }));

    await waitFor(() => {
      expect(service.create).toHaveBeenCalledWith({
        name: "Testovací produkt",
        quantity: "5",
        category: "1",
      });
    });

    expect(push).toHaveBeenCalledWith("/produkty");
  });

  it("zobrazí chybovou zprávu při selhání odeslání", async () => {
    service.create.mockRejectedValueOnce(new Error("Chyba vytvoření"));

    render(
      <NewEntityForm
        title="Nový produkt"
        fields={fields}
        selectFields={[]}
        service={service}
        redirectPath="/produkty"
      />
    );

    fireEvent.change(screen.getByLabelText(/Název/i), {
      target: { value: "Chybný produkt", name: "name" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Vytvořit/i }));

    await waitFor(() => {
      expect(setMessage).toHaveBeenCalledWith(
        "Error creating entity: Chyba vytvoření"
      );
    });
  });
});
