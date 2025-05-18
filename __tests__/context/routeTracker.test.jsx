import React from "react";
import { render } from "@testing-library/react";
import RouteTracker from "../../context/routerTracker";

// Mockuj usePathname z next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from "next/navigation";

describe("RouteTracker", () => {
  beforeEach(() => {
    // Mock pathname
    usePathname.mockReturnValue("/test-page");

    // Mock window.localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("uloží URL do localStorage při změně pathname", () => {
    render(<RouteTracker />);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "lastVisitedUrl",
      "/test-page"
    );
  });
});
