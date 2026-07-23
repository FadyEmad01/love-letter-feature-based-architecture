import { loginSchema, registerSchema } from "../validation";

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------
describe("loginSchema", () => {
  describe("email validation", () => {
    it("rejects empty email", () => {
      const result = loginSchema.safeParse({
        email: "",
        password: "validpass1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address",
        );
      }
    });

    it("rejects email without @ symbol", () => {
      const result = loginSchema.safeParse({
        email: "userexample.com",
        password: "validpass1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address",
        );
      }
    });

    it("rejects email without domain", () => {
      const result = loginSchema.safeParse({
        email: "user@",
        password: "validpass1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address",
        );
      }
    });
  });

  describe("password validation", () => {
    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password is required");
      }
    });
  });

  describe("valid inputs", () => {
    it("accepts valid email and password", () => {
      const input = { email: "user@example.com", password: "mypassword" };
      const result = loginSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(input);
      }
    });

    it("handles typical real-world inputs", () => {
      const input = { email: "  user@example.com  ", password: "password123" };
      const result = loginSchema.safeParse(input);
      // Zod string().email() does not trim automatically; spaces cause rejection
      expect(result.success).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// registerSchema
// ---------------------------------------------------------------------------
describe("registerSchema", () => {
  const validInput = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "Securepass1",
    confirmPassword: "Securepass1",
  };

  // -- Name -----------------------------------------------------------------
  describe("name validation", () => {
    it("rejects empty string", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        name: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Name must be at least 2 characters long",
        );
      }
    });

    it("rejects single character", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        name: "A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Name must be at least 2 characters long",
        );
      }
    });

    it("rejects name longer than 100 characters", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        name: "A".repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Name must be under 100 characters",
        );
      }
    });

    it("accepts valid name (2-100 characters)", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        name: "Ab",
      });
      expect(result.success).toBe(true);

      const resultMax = registerSchema.safeParse({
        ...validInput,
        name: "A".repeat(100),
      });
      expect(resultMax.success).toBe(true);
    });
  });

  // -- Email ----------------------------------------------------------------
  describe("email validation", () => {
    it("rejects empty email", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        email: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address",
        );
      }
    });

    it("rejects email without @ symbol", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        email: "userexample.com",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address",
        );
      }
    });

    it("rejects email without domain", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        email: "user@",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address",
        );
      }
    });

    it("accepts valid email", () => {
      const result = registerSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  // -- Password -------------------------------------------------------------
  describe("password validation", () => {
    it("rejects empty password", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        password: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must be at least 8 characters long",
        );
      }
    });

    it("rejects password shorter than 8 characters", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        password: "Ab1ab",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must be at least 8 characters long",
        );
      }
    });

    it("rejects password longer than 128 characters", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        password: `${"A".repeat(126)}bc1`,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must be under 128 characters",
        );
      }
    });

    it("rejects password missing a number", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        password: "NoNumberHere",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must contain at least 1 number",
        );
      }
    });

    it("rejects password missing a lowercase letter", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        password: "ALLUPPER1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must contain at least 1 lowercase letter",
        );
      }
    });

    it("rejects password missing an uppercase letter", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        password: "alllower1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must contain at least 1 uppercase letter",
        );
      }
    });

    it("accepts password meeting all requirements", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        password: "Testpass1",
        confirmPassword: "Testpass1",
      });
      expect(result.success).toBe(true);
    });
  });

  // -- Combined field validation ---------------------------------------------
  describe("combined field validation", () => {
    it("rejects if any field is invalid", () => {
      const result = registerSchema.safeParse({
        name: "",
        email: "invalid",
        password: "weak",
        confirmPassword: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
      }
    });

    it("accepts complete valid input", () => {
      const result = registerSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validInput);
      }
    });

    it("rejects when passwords don't match", () => {
      const result = registerSchema.safeParse({
        ...validInput,
        confirmPassword: "DifferentPass1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) =>
          i.path.includes("confirmPassword"),
        );
        expect(confirmError?.message).toBe("Passwords don't match");
      }
    });
  });
});
