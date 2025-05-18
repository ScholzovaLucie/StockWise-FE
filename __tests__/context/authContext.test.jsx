import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../context/authContext";
import * as authService from "../../services/authService";
import { useRouter } from "next/navigation";

// Mock routeru next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Komponenta, která používá useAuth pro zobrazení uživatele a reload
const TestComponent = () => {
  const { user, reloadUser } = useAuth();
  return (
    <>
      <div data-testid="user">{user?.name}</div>
      <button onClick={reloadUser}>Reload</button>
    </>
  );
};

describe("AuthProvider", () => {
  const mockPush = jest.fn();

  // Před každým testem nastavíme router a vyčistíme mocky
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  it("zobrazí LoadingScreen během načítání", async () => {
    // Simulujeme, že fetchCurrentUser nikdy nedoběhne (nekonečné načítání)
    jest
      .spyOn(authService, "fetchCurrentUser")
      .mockImplementation(() => new Promise(() => {}));

    render(
      <AuthProvider>
        <div>App</div>
      </AuthProvider>
    );

    // Ověříme, že se zobrazuje loading hláška
    expect(screen.getByText(/Načítám, vydržte/i)).toBeInTheDocument();
  });

  it("nastaví uživatele, pokud se fetchCurrentUser podaří", async () => {
    // Simulujeme úspěšné načtení uživatele
    jest
      .spyOn(authService, "fetchCurrentUser")
      .mockResolvedValue({ id: 1, name: "TestUser" });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Ověříme, že se jméno uživatele zobrazí po načtení
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("TestUser");
    });
  });

  it("přesměruje na /auth/login při selhání načtení", async () => {
    // Simulujeme selhání (např. neautorizovaného uživatele)
    jest
      .spyOn(authService, "fetchCurrentUser")
      .mockRejectedValue(new Error("Neautorizovaný"));

    render(
      <AuthProvider>
        <div>App</div>
      </AuthProvider>
    );

    // Ověříme, že se volá redirect na /auth/login
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });
});
