import React from "react";
import { render, screen } from "@testing-library/react";
import { ClientProvider, useClient } from "../../context/clientContext";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  Object.defineProperty(window, "sessionStorage", {
    value: window.sessionStorage,
    writable: true,
  });
  sessionStorage.clear();
  jest.restoreAllMocks();
});

const TestComponent = () => {
  const { selectedClient, setSelectedClient } = useClient();
  return (
    <div>
      <div data-testid="selected">{selectedClient}</div>
      <button onClick={() => setSelectedClient("123")}>Změnit</button>
    </div>
  );
};

describe("ClientProvider", () => {
  it("načte klienta ze sessionStorage při mountu", () => {
    window.sessionStorage.setItem("selectedClient", "42");

    render(
      <ClientProvider>
        <TestComponent />
      </ClientProvider>
    );

    expect(screen.getByTestId("selected").textContent).toBe("42");
  });

  it("uloží klienta do sessionStorage při změně", async () => {
    render(
      <ClientProvider>
        <TestComponent />
      </ClientProvider>
    );

    await userEvent.click(screen.getByText("Změnit"));
    expect(sessionStorage.getItem("selectedClient")).toBe("123");
    expect(screen.getByTestId("selected").textContent).toBe("123");
  });
});
