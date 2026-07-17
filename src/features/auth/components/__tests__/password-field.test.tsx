import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { useState } from "react";

import { PasswordField } from "@/features/auth/components/password-field";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Renders the input element directly (password inputs have no textbox role in jsdom). */
function getInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector('input[data-slot="input"]');
  if (!input) throw new Error("Could not find input element");
  return input as HTMLInputElement;
}

/** Wrapper that manages controlled `value` / `onChange` state. */
function ControlledPasswordField(
  props: Omit<ComponentProps<typeof PasswordField>, "value" | "onChange"> & {
    initialValue?: string;
  },
) {
  const { initialValue = "", ...rest } = props;
  const [value, setValue] = useState(initialValue);
  return <PasswordField {...rest} value={value} onChange={setValue} />;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("PasswordField", () => {
  describe("Rendering & Toggle", () => {
    it("renders input with type='password' by default", () => {
      const { container } = render(<ControlledPasswordField />);

      expect(getInput(container)).toHaveAttribute("type", "password");
    });

    it("shows placeholder text when provided", () => {
      render(<ControlledPasswordField placeholder="Enter secret" />);

      expect(screen.getByPlaceholderText("Enter secret")).toBeInTheDocument();
    });

    it("toggle button switches input to type='text'", async () => {
      const user = userEvent.setup();
      const { container } = render(<ControlledPasswordField />);

      await user.click(screen.getByRole("button", { name: /show password/i }));

      expect(getInput(container)).toHaveAttribute("type", "text");
    });

    it("toggle button switches back to type='password' on second click", async () => {
      const user = userEvent.setup();
      const { container } = render(<ControlledPasswordField />);

      const toggle = screen.getByRole("button", { name: /show password/i });
      await user.click(toggle);
      await user.click(toggle);

      expect(getInput(container)).toHaveAttribute("type", "password");
    });

    it("toggle button has aria-label='Show password' when hidden", () => {
      render(<ControlledPasswordField />);

      expect(
        screen.getByRole("button", { name: "Show password" }),
      ).toHaveAttribute("aria-label", "Show password");
    });

    it("toggle button has aria-label='Hide password' when visible", async () => {
      const user = userEvent.setup();
      render(<ControlledPasswordField />);

      await user.click(screen.getByRole("button", { name: /show password/i }));

      expect(
        screen.getByRole("button", { name: "Hide password" }),
      ).toHaveAttribute("aria-label", "Hide password");
    });

    it("toggle button has aria-pressed={false} when hidden, {true} when visible", async () => {
      const user = userEvent.setup();
      render(<ControlledPasswordField />);

      const toggle = screen.getByRole("button", { name: /show password/i });
      expect(toggle).toHaveAttribute("aria-pressed", "false");

      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-pressed", "true");

      await user.click(toggle);
      expect(toggle).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Password Strength (showStrength=true)", () => {
    it("shows 'Enter a password' when value is empty", () => {
      render(<ControlledPasswordField showStrength initialValue="" />);

      expect(screen.getByText(/Enter a password/)).toBeInTheDocument();
    });

    it("shows 'Weak password' for 'abc' (1 requirement: lowercase)", () => {
      render(<ControlledPasswordField showStrength initialValue="abc" />);

      expect(screen.getByText(/Weak password/)).toBeInTheDocument();
    });

    it("shows 'Weak password' for 'abc1' (2 requirements: lowercase + number)", () => {
      render(<ControlledPasswordField showStrength initialValue="abc1" />);

      expect(screen.getByText(/Weak password/)).toBeInTheDocument();
    });

    it("shows 'Medium password' for 'Abc1' (3 requirements: lowercase + uppercase + number)", () => {
      render(<ControlledPasswordField showStrength initialValue="Abc1" />);

      expect(screen.getByText(/Medium password/)).toBeInTheDocument();
    });

    it("shows 'Strong password' for 'Abc1test' (all 4 requirements met)", () => {
      render(<ControlledPasswordField showStrength initialValue="Abc1test" />);

      expect(screen.getByText(/Strong password/)).toBeInTheDocument();
    });

    it("shows 'Must contain:' text near the strength label", () => {
      render(<ControlledPasswordField showStrength />);

      expect(screen.getByText(/Must contain:/)).toBeInTheDocument();
    });
  });

  describe("Requirements List (showStrength=true)", () => {
    it("shows all 4 requirement items when showStrength is true", () => {
      render(<ControlledPasswordField showStrength initialValue="" />);

      const list = screen.getByRole("list", { name: /password requirements/i });
      const items = within(list).getAllByRole("listitem");
      expect(items).toHaveLength(4);
    });

    it("shows check icons for met requirements and X icons for unmet", () => {
      // "abc1" → lowercase ✓, number ✓, uppercase ✗, 8+ chars ✗
      // Result: 2 check icons, 2 X icons
      render(<ControlledPasswordField showStrength initialValue="abc1" />);

      const list = screen.getByRole("list", { name: /password requirements/i });

      // Lucide icons use SVG elements with CSS classes, not accessible "img" roles
      // (they have aria-hidden="true"). Query by class name directly.
      const checkIcons = list.querySelectorAll(".lucide-check");
      const xIcons = list.querySelectorAll(".lucide-x");

      expect(checkIcons).toHaveLength(2);
      expect(xIcons).toHaveLength(2);
    });

    it("shows all check icons when all requirements are met", () => {
      render(<ControlledPasswordField showStrength initialValue="Abc1test" />);

      const list = screen.getByRole("list", { name: /password requirements/i });
      const checkIcons = list.querySelectorAll(".lucide-check");
      const xIcons = list.querySelectorAll(".lucide-x");

      expect(checkIcons).toHaveLength(4);
      expect(xIcons).toHaveLength(0);
    });

    it("has aria-label='Password requirements' on the <ul> element", () => {
      render(<ControlledPasswordField showStrength />);

      expect(
        screen.getByRole("list", { name: "Password requirements" }),
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("input has aria-describedby when showStrength is true", () => {
      const { container } = render(
        <ControlledPasswordField id="pw" showStrength />,
      );

      expect(getInput(container)).toHaveAttribute(
        "aria-describedby",
        "pw-description",
      );
    });

    it("input has no aria-describedby when showStrength is false", () => {
      const { container } = render(<ControlledPasswordField id="pw" />);

      expect(getInput(container)).not.toHaveAttribute("aria-describedby");
    });

    it("sr-only text shows 'Requirement met' / 'Requirement not met' for each requirement", () => {
      // "Abc1" → 3 met, 1 unmet (8+ chars fails since length is 4)
      render(<ControlledPasswordField showStrength initialValue="Abc1" />);

      const list = screen.getByRole("list", { name: /password requirements/i });
      const items = within(list).getAllByRole("listitem");

      // "At least 8 characters" → not met
      expect(
        within(items[0]).getByText(/Requirement not met/),
      ).toBeInTheDocument();
      // "At least 1 number" → met
      expect(within(items[1]).getByText(/Requirement met/)).toBeInTheDocument();
      // "At least 1 lowercase letter" → met
      expect(within(items[2]).getByText(/Requirement met/)).toBeInTheDocument();
      // "At least 1 uppercase letter" → met
      expect(within(items[3]).getByText(/Requirement met/)).toBeInTheDocument();
    });

    it("shows no strength section when showStrength is false", () => {
      render(<ControlledPasswordField showStrength={false} />);

      expect(
        screen.queryByRole("list", { name: /password requirements/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/Must contain:/)).not.toBeInTheDocument();
    });
  });

  describe("Styling & Strength Text", () => {
    // NOTE: The progress bar (role="progressbar") is commented out in the source.
    // We test the strength text content to verify the score-to-text mapping.

    it("shows 'Enter a password, Must contain:' for empty value (score 0)", () => {
      render(<ControlledPasswordField showStrength initialValue="" />);

      expect(screen.getByText(/Must contain:/)).toHaveTextContent(
        "Enter a password, Must contain:",
      );
    });

    it("shows 'Strong password, Must contain:' for a fully valid password (score 4)", () => {
      render(<ControlledPasswordField showStrength initialValue="Abc1test" />);

      expect(screen.getByText(/Must contain:/)).toHaveTextContent(
        "Strong password, Must contain:",
      );
    });
  });
});
