import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Hoisted mock functions — referenced inside vi.mock factories
const mocks = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockSignOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.mockPush }),
}));

vi.mock("@/features/auth/lib/auth-client", () => ({
  authClient: {
    signOut: mocks.mockSignOut,
  },
}));

import { SignOutButton } from "@/features/auth/components/sign-out-button";

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

afterEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SignOutButton", () => {
  describe("Rendering", () => {
    it("renders a sign-out button", () => {
      render(<SignOutButton />);

      expect(
        screen.getByRole("button", { name: /sign out/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Sign-out flow", () => {
    it("calls signOut when the button is clicked", async () => {
      const user = userEvent.setup();
      mocks.mockSignOut.mockResolvedValueOnce(undefined);
      render(<SignOutButton />);

      await user.click(screen.getByRole("button", { name: /sign out/i }));

      await waitFor(() => {
        expect(mocks.mockSignOut).toHaveBeenCalledTimes(1);
      });
    });

    it("redirects to /auth/login after successful sign-out", async () => {
      const user = userEvent.setup();
      mocks.mockSignOut.mockResolvedValueOnce(undefined);
      render(<SignOutButton />);

      await user.click(screen.getByRole("button", { name: /sign out/i }));

      await waitFor(() => {
        expect(mocks.mockPush).toHaveBeenCalledWith("/auth/login");
      });
    });
  });

  describe("Error handling", () => {
    it("redirects to /auth/login even when signOut rejects", async () => {
      const user = userEvent.setup();
      mocks.mockSignOut.mockRejectedValueOnce(new Error("Network failure"));
      render(<SignOutButton />);

      await user.click(screen.getByRole("button", { name: /sign out/i }));

      await waitFor(() => {
        expect(mocks.mockSignOut).toHaveBeenCalledTimes(1);
        expect(mocks.mockPush).toHaveBeenCalledWith("/auth/login");
      });
    });
  });
});
