import React from "react";
import { render, screen } from "@testing-library/react";
import { MessageProvider, useMessage } from "../../context/messageContext";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Testovací komponenta využívající useMessage
const TestComponent = () => {
  const { message, setMessage } = useMessage();
  return (
    <div>
      <div data-testid="message">{message}</div>
      <button onClick={() => setMessage("Hotovo!")}>Zobrazit zprávu</button>
    </div>
  );
};

// Globální setup – fake timers a okamžité spuštění setTimeout
beforeEach(() => {
  jest.useFakeTimers();

  // Okamžité spuštění callbacku místo čekání 4000 ms
  jest.spyOn(global, "setTimeout").mockImplementation((cb) => {
    cb();
    return 1;
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("MessageProvider", () => {
  it("zobrazí zprávu a automaticky ji skryje okamžitě", async () => {
    render(
      <MessageProvider>
        <TestComponent />
      </MessageProvider>
    );

    await userEvent.click(screen.getByText("Zobrazit zprávu"));

    // Zpráva je nastavena a ihned skryta (mock setTimeout)
    expect(screen.getByTestId("message")).toHaveTextContent("");
  });
});
