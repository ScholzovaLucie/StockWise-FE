import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EntityList from "../../components/EntityList";
import { useRouter } from "next/navigation";
import { useClient } from "context/clientContext";
import { useMessage } from "context/messageContext";

// Mock router, client a message kontext
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("context/clientContext", () => ({
  useClient: jest.fn(),
}));

jest.mock("context/messageContext", () => ({
  useMessage: jest.fn(),
}));

describe("EntityList", () => {
  const mockPush = jest.fn();
  const mockSetMessage = jest.fn();
  const mockService = {
    getAll: jest
      .fn()
      .mockResolvedValue({ results: [{ id: 1, name: "Test" }], count: 1 }),
    search: jest.fn().mockResolvedValue({
      results: [{ id: 2, name: "Search Result" }],
      count: 1,
    }),
    delete: jest.fn().mockResolvedValue({}),
  };

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    useClient.mockReturnValue({ selectedClient: 1 });
    useMessage.mockReturnValue({ setMessage: mockSetMessage });
  });

  it("zobrazí nadpis a tlačítko pro přidání", async () => {
    render(
      <EntityList
        title="Testovací Seznam"
        service={mockService}
        columns={[{ field: "name", headerName: "Název", flex: 1 }]}
        addPath="/add"
        viewPath="/view"
      />
    );

    expect(screen.getByText("Testovací Seznam")).toBeInTheDocument();

    const addButton = screen.getByRole("button", { name: /nový/i });
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(mockPush).toHaveBeenCalledWith("/add");

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  it("vyhledá položku pomocí hledacího pole", async () => {
    render(
      <EntityList
        title="Hledání"
        service={mockService}
        columns={[{ field: "name", headerName: "Název", flex: 1 }]}
        addPath="/add"
        viewPath="/view"
      />
    );

    const input = screen.getByLabelText(/hledat/i);
    fireEvent.change(input, { target: { value: "test" } });

    await waitFor(() => {
      expect(mockService.search).toHaveBeenCalled();
    });
  });

  it("smaže položku po potvrzení", async () => {
    // potvrzení přes `window.confirm`
    window.confirm = jest.fn(() => true);

    render(
      <EntityList
        title="Mazání"
        service={mockService}
        columns={[{ field: "name", headerName: "Název", flex: 1 }]}
        addPath="/add"
        viewPath="/view"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole("button", {
      name: /smazat/i,
    });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockService.delete).toHaveBeenCalledWith(1);
    });
  });
});
