import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Hoisted mock functions — referenced inside vi.mock factories
const mocks = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockSignInEmail: vi.fn(),
  mockGoeyToastFn: vi.fn(() => "test-toast-id" as string | number),
  mockGoeyToastUpdate: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.mockPush }),
}));

vi.mock("@/features/auth/lib/auth-client", () => ({
  authClient: {
    signIn: { email: mocks.mockSignInEmail },
  },
}));

vi.mock("goey-toast", () => ({
  goeyToast: Object.assign(mocks.mockGoeyToastFn, {
    update: mocks.mockGoeyToastUpdate,
  }),
}));

import LoginForm from "@/features/auth/components/login-form";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a可控 promise so tests can inspect intermediate loading state. */
function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function fillFormAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  email = "test@example.com",
  password = "Password123",
) {
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: /sign in/i }));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

afterEach(() => {
  vi.clearAllMocks();
});

describe("LoginForm", () => {
  const validEmail = "test@example.com";
  const validPassword = "Password123";

  describe("Rendering", () => {
    it("renders email input, password input, and sign-in button", () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    it("renders a link to the registration page", () => {
      render(<LoginForm />);

      const registerLink = screen.getByRole("link", { name: /sign up/i });
      expect(registerLink).toHaveAttribute("href", "/auth/register");
    });
  });

  describe("Validation", () => {
    it("shows errors when submitting an empty form", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address"),
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Password is required")).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText("Password");
      expect(passwordInput).toHaveAttribute("aria-invalid", "true");

      expect(mocks.mockSignInEmail).not.toHaveBeenCalled();
    });

    it("shows email error for invalid email format", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.type(screen.getByLabelText("Email"), "notanemail");
      await user.type(screen.getByLabelText("Password"), validPassword);
      await user.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address"),
        ).toBeInTheDocument();
      });
      expect(mocks.mockSignInEmail).not.toHaveBeenCalled();
    });
  });

  describe("Successful login", () => {
    it("calls signIn.email with correct credentials, shows success toast, and redirects", async () => {
      const user = userEvent.setup();
      mocks.mockSignInEmail.mockResolvedValueOnce({ error: null });
      render(<LoginForm />);

      await fillFormAndSubmit(user, validEmail, validPassword);

      await waitFor(() => {
        expect(mocks.mockSignInEmail).toHaveBeenCalledWith({
          email: validEmail,
          password: validPassword,
        });
      });

      // Initial "Signing in..." toast
      expect(mocks.mockGoeyToastFn).toHaveBeenCalledWith(
        "Signing in...",
        expect.objectContaining({ icon: expect.anything() }),
      );

      // Success update on the same toast id
      expect(mocks.mockGoeyToastUpdate).toHaveBeenCalledWith(
        "test-toast-id",
        expect.objectContaining({
          type: "success",
          title: "Signed in successfully!",
        }),
      );

      expect(mocks.mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("Failed login", () => {
    it("shows error toast when API returns an error object", async () => {
      const user = userEvent.setup();
      mocks.mockSignInEmail.mockResolvedValueOnce({
        error: { message: "Invalid credentials" },
      });
      render(<LoginForm />);

      await fillFormAndSubmit(user, validEmail, validPassword);

      await waitFor(() => {
        expect(mocks.mockGoeyToastUpdate).toHaveBeenCalledWith(
          "test-toast-id",
          expect.objectContaining({
            type: "error",
            title: "Invalid credentials",
          }),
        );
      });

      expect(mocks.mockPush).not.toHaveBeenCalled();
    });

    it("shows fallback toast when signIn.email throws a non-Error value", async () => {
      const user = userEvent.setup();
      mocks.mockSignInEmail.mockRejectedValueOnce("network failure");
      render(<LoginForm />);

      await fillFormAndSubmit(user, validEmail, validPassword);

      await waitFor(() => {
        expect(mocks.mockGoeyToastUpdate).toHaveBeenCalledWith(
          "test-toast-id",
          expect.objectContaining({
            type: "error",
            title: "Something went wrong. Please try again.",
          }),
        );
      });

      expect(mocks.mockPush).not.toHaveBeenCalled();
    });

    it("shows error message from thrown Error instance", async () => {
      const user = userEvent.setup();
      mocks.mockSignInEmail.mockRejectedValueOnce(new Error("Network timeout"));
      render(<LoginForm />);

      await fillFormAndSubmit(user, validEmail, validPassword);

      await waitFor(() => {
        expect(mocks.mockGoeyToastUpdate).toHaveBeenCalledWith(
          "test-toast-id",
          expect.objectContaining({
            type: "error",
            title: "Network timeout",
          }),
        );
      });
    });
  });

  describe("Loading state", () => {
    it("disables button and shows loading text while submission is in progress", async () => {
      const user = userEvent.setup();
      const deferred = createDeferred<{
        error: { message: string } | null;
      }>();
      mocks.mockSignInEmail.mockReturnValueOnce(deferred.promise);
      render(<LoginForm />);

      const submitButton = screen.getByRole("button", {
        name: /sign in/i,
      });

      await user.type(screen.getByLabelText("Email"), validEmail);
      await user.type(screen.getByLabelText("Password"), validPassword);
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent("Signing in...");
      });

      // Resolve with error to trigger setIsLoading(false) and restore button
      deferred.resolve({ error: { message: "failed" } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent("Sign in");
      });
    });
  });
});
