import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logout,
  changePassword,
  requestPasswordReset,
  resetPassword,
} from "../../services/authService";
import api from "../../services/apiClient";

jest.mock("../../services/apiClient");

delete window.location;
window.location = { href: "" };

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loginUser - úspěšné přihlášení", async () => {
    api.post.mockResolvedValue({ data: { token: "abc" } });
    const data = await loginUser("test@example.com", "pass");
    expect(api.post).toHaveBeenCalledWith(
      "/auth/login/",
      { email: "test@example.com", password: "pass" },
      { withCredentials: true }
    );
    expect(data).toEqual({ token: "abc" });
  });

  it("loginUser - chyba při přihlášení", async () => {
    api.post.mockRejectedValue({ response: { data: { error: "Chyba" } } });
    await expect(loginUser("a", "b")).rejects.toThrow("Chyba");
  });

  it("registerUser - úspěšná registrace", async () => {
    api.post.mockResolvedValue({ data: { id: 1 } });
    const res = await registerUser("a", "b");
    expect(api.post).toHaveBeenCalledWith(
      "/auth/register/",
      { email: "a", password: "b" },
      { withCredentials: true }
    );
    expect(res).toEqual({ id: 1 });
  });

  it("fetchCurrentUser - úspěch", async () => {
    api.get.mockResolvedValue({ data: { user: "abc" } });
    const data = await fetchCurrentUser();
    expect(api.get).toHaveBeenCalledWith("/auth/me/", {
      withCredentials: true,
    });
    expect(data).toEqual({ user: "abc" });
  });

  it("fetchCurrentUser - chyba", async () => {
    api.get.mockRejectedValue(new Error("Nepřihlášen"));
    const result = await fetchCurrentUser();
    expect(result).toBeNull();
  });

  it("logout - přesměrování funguje", async () => {
    api.post.mockResolvedValue({});
    await logout();
    expect(api.post).toHaveBeenCalledWith(
      "/auth/logout/",
      {},
      { withCredentials: true }
    );
    expect(window.location.href).toBe("/auth/login");
  });

  it("changePassword - úspěch", async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    const res = await changePassword("a", "b", "b");
    expect(api.post).toHaveBeenCalledWith(
      "/auth/change-password/",
      { old_password: "a", new_password: "b", confirm_password: "b" },
      { withCredentials: true }
    );
    expect(res).toEqual({ success: true });
  });

  it("requestPasswordReset - úspěch", async () => {
    api.post.mockResolvedValue({ data: { message: "ok" } });
    const res = await requestPasswordReset("a@example.com");
    expect(api.post).toHaveBeenCalledWith(
      "/auth/request-password-reset/",
      { email: "a@example.com" },
      { withCredentials: true }
    );
    expect(res).toEqual({ message: "ok" });
  });

  it("resetPassword - úspěch", async () => {
    api.post.mockResolvedValue({ data: { done: true } });
    const res = await resetPassword("token123", "a", "a");
    expect(api.post).toHaveBeenCalledWith(
      "/auth/reset-password/",
      { token: "token123", new_password: "a", confirm_password: "a" },
      { withCredentials: true }
    );
    expect(res).toEqual({ done: true });
  });
});
