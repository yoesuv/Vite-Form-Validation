import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import { describe, it, expect } from "vitest";

function renderLoginForm() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  );
}

// Match the input exactly — /password/i would also hit the toggle
// button's "Show password" aria-label
function getPasswordInput() {
  return screen.getByLabelText(/^password$/i);
}

describe("LoginForm - password field validation", () => {
  it("shows an error when the password is empty and blurred", async () => {
    renderLoginForm();

    const passwordInput = getPasswordInput();
    await userEvent.click(passwordInput);
    await userEvent.tab(); // blur the field

    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("shows an error when the password is shorter than 8 characters", async () => {
    renderLoginForm();

    const passwordInput = getPasswordInput();
    await userEvent.type(passwordInput, "short");
    await userEvent.tab();

    expect(
      screen.getByText(/password must be at least 8 characters/i),
    ).toBeInTheDocument();
  });

  it("does not show an error before the field is touched", () => {
    renderLoginForm();

    expect(
      screen.queryByText(/password is required/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/password must be at least 8 characters/i),
    ).not.toBeInTheDocument();
  });

  it("clears the error once a valid password is entered", async () => {
    renderLoginForm();

    const passwordInput = getPasswordInput();
    await userEvent.type(passwordInput, "short");
    await userEvent.tab();

    expect(
      screen.getByText(/password must be at least 8 characters/i),
    ).toBeInTheDocument();

    await userEvent.type(passwordInput, "12345678");

    expect(
      screen.queryByText(/password must be at least 8 characters/i),
    ).not.toBeInTheDocument();
  });

  it("marks the password input as invalid via aria-invalid when the password is bad", async () => {
    renderLoginForm();

    const passwordInput = getPasswordInput();
    await userEvent.type(passwordInput, "abc");
    await userEvent.tab();

    expect(passwordInput).toHaveAttribute("aria-invalid", "true");
    expect(passwordInput).toHaveAccessibleDescription(
      /password must be at least 8 characters/i,
    );
  });

  it("does not trim whitespace, so a short whitespace-only password hits the length error", async () => {
    renderLoginForm();

    const passwordInput = getPasswordInput();
    await userEvent.type(passwordInput, "   ");
    await userEvent.tab();

    // The password schema has no .trim(), so "   " is a 3-char value,
    // not an empty one — the length error fires, not the required error
    expect(
      screen.getByText(/password must be at least 8 characters/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/password is required/i),
    ).not.toBeInTheDocument();
  });

  it("accepts a whitespace-only password of 8+ characters (no trimming)", async () => {
    renderLoginForm();

    const passwordInput = getPasswordInput();
    await userEvent.type(passwordInput, "        "); // 8 spaces
    await userEvent.tab();

    expect(
      screen.queryByText(/password must be at least 8 characters/i),
    ).not.toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("aria-invalid", "false");
  });

  it("accepts a password of exactly 8 characters", async () => {
    renderLoginForm();

    const passwordInput = getPasswordInput();
    await userEvent.type(passwordInput, "12345678");
    await userEvent.tab();

    expect(
      screen.queryByText(/password must be at least 8 characters/i),
    ).not.toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("aria-invalid", "false");
  });

  it("rejects a password of 7 characters", async () => {
    renderLoginForm();

    const passwordInput = getPasswordInput();
    await userEvent.type(passwordInput, "1234567");
    await userEvent.tab();

    expect(
      screen.getByText(/password must be at least 8 characters/i),
    ).toBeInTheDocument();
  });

  it("toggles password visibility between hidden and shown", async () => {
    renderLoginForm();

    const passwordInput = getPasswordInput();
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button", {
      name: /show password/i,
    });
    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(
      screen.getByRole("button", { name: /hide password/i }),
    );

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(toggleButton).toHaveAttribute("aria-pressed", "false");
  });
});
