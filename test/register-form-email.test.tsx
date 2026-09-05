import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { RegisterForm } from "@/components/register-form";
import { describe, it, expect } from "vitest";

function renderRegisterForm() {
  return render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>,
  );
}

describe("RegisterForm - email field validation", () => {
  it("shows an error when the email is empty and blurred", async () => {
    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.click(emailInput);
    await userEvent.tab(); // blur the field

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("shows an error when an invalid email is typed", async () => {
    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "not-an-email");
    await userEvent.tab();

    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
  });

  it("does not show an error before the field is touched", () => {
    renderRegisterForm();

    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/invalid email address/i),
    ).not.toBeInTheDocument();
  });

  it("clears the error once a valid email is entered", async () => {
    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "not-an-email");
    await userEvent.tab();

    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "user@example.com");

    expect(
      screen.queryByText(/invalid email address/i),
    ).not.toBeInTheDocument();
  });

  it("marks the email input as invalid via aria-invalid when the email is bad", async () => {
    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "bad@");
    await userEvent.tab();

    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput).toHaveAccessibleDescription(/invalid email address/i);
  });

  it("treats a whitespace-only email as required", async () => {
    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "   ");
    await userEvent.tab();

    // .trim() in the schema turns "   " into "", so the required error fires
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/invalid email address/i),
    ).not.toBeInTheDocument();
  });

  it("accepts a valid email with surrounding whitespace (trimmed)", async () => {
    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, " user@example.com ");
    await userEvent.tab();

    expect(
      screen.queryByText(/invalid email address/i),
    ).not.toBeInTheDocument();
    expect(emailInput).toHaveAttribute("aria-invalid", "false");
  });

  it("rejects an email without a TLD", async () => {
    renderRegisterForm();

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "user@example");
    await userEvent.tab();

    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
  });
});
