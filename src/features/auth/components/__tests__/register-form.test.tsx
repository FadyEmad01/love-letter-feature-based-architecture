import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Hoisted mock functions — referenced inside vi.mock factories
const mocks = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockSignUpEmail: vi.fn(),
  mockGoeyToastFn: vi.fn(() => "test-toast-id" as string | number),
  mockGoeyToastUpdate: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.mockPush }),
}));

vi.mock("@/features/auth/lib/auth-client", () => ({
  authClient: {
    signUp: { email: mocks.mockSignUpEmail },
  },
}));

vi.mock("goey-toast", () => ({
  goeyToast: Object.assign(mocks.mockGoeyToastFn, {
    update: mocks.mockGoeyToastUpdate,
  }),
}));

import RegisterForm from "@/features/auth/components/register-form";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a controllable promise so tests can inspect intermediate loading state. */
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
  name = "Jane Doe",
  email = "jane@example.com",
  password = "Password123",
) {
  await user.type(screen.getByLabelText("Name"), name);
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.type(screen.getByLabelText("Confirm Password"), password);
  await user.click(screen.getByRole("button", { name: /create account/i }));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

afterEach(() => {
  vi.clearAllMocks();
});

describe("RegisterForm", () => {
  const validName = "Jane Doe";
  const validEmail = "jane@example.com";
  const validPassword = "Password123";

  describe("Rendering", () => {
    it("renders name, email, password, and confirm password inputs plus submit button", () => {
      render(<RegisterForm />);

      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create account/i }),
      ).toBeInTheDocument();
    });

    it("renders a link to the login page", () => {
      render(<RegisterForm />);

      const loginLink = screen.getByRole("link", { name: /sign in/i });
      expect(loginLink).toHaveAttribute("href", "/auth/login");
    });
  });

  describe("Validation", () => {
    it("shows errors when submitting an empty form", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Name must be at least 2 characters long"),
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address"),
        ).toBeInTheDocument();
      });

      expect(mocks.mockSignUpEmail).not.toHaveBeenCalled();
    });

    it("shows name error when name is too short", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText("Name"), "J");
      await user.type(screen.getByLabelText("Email"), validEmail);
      await user.type(screen.getByLabelText("Password"), validPassword);
      await user.type(screen.getByLabelText("Confirm Password"), validPassword);
      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Name must be at least 2 characters long"),
        ).toBeInTheDocument();
      });

      expect(mocks.mockSignUpEmail).not.toHaveBeenCalled();
    });

    it("blocks submission for a weak password", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText("Name"), validName);
      await user.type(screen.getByLabelText("Email"), validEmail);
      // "weak" — no number, no uppercase, < 8 chars
      await user.type(screen.getByLabelText("Password"), "weak");
      await user.type(screen.getByLabelText("Confirm Password"), "weak");
      await user.click(screen.getByRole("button", { name: /create account/i }));

      expect(mocks.mockSignUpEmail).not.toHaveBeenCalled();
    });

    it("shows email error for invalid email format", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText("Name"), validName);
      await user.type(screen.getByLabelText("Email"), "notanemail");
      await user.type(screen.getByLabelText("Password"), validPassword);
      await user.type(screen.getByLabelText("Confirm Password"), validPassword);
      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address"),
        ).toBeInTheDocument();
      });

      expect(mocks.mockSignUpEmail).not.toHaveBeenCalled();
    });

    it("shows confirm password mismatch error", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText("Name"), validName);
      await user.type(screen.getByLabelText("Email"), validEmail);
      await user.type(screen.getByLabelText("Password"), validPassword);
      await user.type(
        screen.getByLabelText("Confirm Password"),
        "DifferentPass1",
      );
      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
      });

      expect(mocks.mockSignUpEmail).not.toHaveBeenCalled();
    });
  });

  describe("Password strength indicator", () => {
    it("shows 'Enter a password' when password is empty", async () => {
      userEvent.setup();
      render(<RegisterForm />);

      // Password field starts empty — strength text should be present
      expect(screen.getByText(/Enter a password/)).toBeInTheDocument();
    });

    it("shows 'Weak password' for 'abc' (1 requirement met)", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText("Password"), "abc");

      await waitFor(() => {
        expect(screen.getByText(/Weak password/)).toBeInTheDocument();
      });
    });

    it("shows 'Weak password' for 'abc1' (2 requirements met)", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText("Password"), "abc1");

      await waitFor(() => {
        expect(screen.getByText(/Weak password/)).toBeInTheDocument();
      });
    });

    it("shows 'Medium password' for 'Abc1' (3 requirements met)", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText("Password"), "Abc1");

      await waitFor(() => {
        expect(screen.getByText(/Medium password/)).toBeInTheDocument();
      });
    });

    it("shows 'Strong password' for 'Abc1test' (all 4 requirements met)", async () => {
      const user = userEvent.setup();
      render(<RegisterForm />);

      await user.type(screen.getByLabelText("Password"), "Abc1test");

      await waitFor(() => {
        expect(screen.getByText(/Strong password/)).toBeInTheDocument();
      });
    });
  });

  describe("Successful registration", () => {
    it("calls signUp.email with correct data, shows success toast, and redirects", async () => {
      const user = userEvent.setup();
      mocks.mockSignUpEmail.mockResolvedValueOnce({ error: null });
      render(<RegisterForm />);

      await fillFormAndSubmit(user, validName, validEmail, validPassword);

      await waitFor(() => {
        expect(mocks.mockSignUpEmail).toHaveBeenCalledWith({
          name: validName,
          email: validEmail,
          password: validPassword,
        });
      });

      // Initial "Creating account..." toast
      expect(mocks.mockGoeyToastFn).toHaveBeenCalledWith(
        "Creating account...",
        expect.objectContaining({ icon: expect.anything() }),
      );

      // Success update on the same toast id
      expect(mocks.mockGoeyToastUpdate).toHaveBeenCalledWith(
        "test-toast-id",
        expect.objectContaining({
          type: "success",
          title: "Account created!",
        }),
      );

      expect(mocks.mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("Failed registration", () => {
    it("shows error toast when API returns an error object", async () => {
      const user = userEvent.setup();
      mocks.mockSignUpEmail.mockResolvedValueOnce({
        error: { message: "Email already exists" },
      });
      render(<RegisterForm />);

      await fillFormAndSubmit(user, validName, validEmail, validPassword);

      await waitFor(() => {
        expect(mocks.mockGoeyToastUpdate).toHaveBeenCalledWith(
          "test-toast-id",
          expect.objectContaining({
            type: "error",
            title: "Email already exists",
          }),
        );
      });

      expect(mocks.mockPush).not.toHaveBeenCalled();
    });

    it("shows fallback toast when signUp.email throws a non-Error value", async () => {
      const user = userEvent.setup();
      mocks.mockSignUpEmail.mockRejectedValueOnce("network failure");
      render(<RegisterForm />);

      await fillFormAndSubmit(user, validName, validEmail, validPassword);

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
  });

  describe("Loading state", () => {
    it("disables button and shows loading text while submission is in progress", async () => {
      const user = userEvent.setup();
      const deferred = createDeferred<{
        error: { message: string } | null;
      }>();
      mocks.mockSignUpEmail.mockReturnValueOnce(deferred.promise);
      render(<RegisterForm />);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });

      await user.type(screen.getByLabelText("Name"), validName);
      await user.type(screen.getByLabelText("Email"), validEmail);
      await user.type(screen.getByLabelText("Password"), validPassword);
      await user.type(screen.getByLabelText("Confirm Password"), validPassword);
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent("Creating account...");
      });

      // Resolve with error to trigger setIsLoading(false) and restore button
      deferred.resolve({ error: { message: "failed" } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent("Create account");
      });
    });
  });
});
