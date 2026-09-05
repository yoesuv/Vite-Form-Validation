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

describe("RegisterForm - full name field validation", () => {
  it("shows an error when the name is empty and blurred", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.click(nameInput);
    await userEvent.tab(); // blur the field

    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
  });

  it("shows an error when the name is shorter than 2 characters", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "J");
    await userEvent.tab();

    expect(
      screen.getByText(/full name must be at least 2 characters/i),
    ).toBeInTheDocument();
  });

  it("does not show an error before the field is touched", () => {
    renderRegisterForm();

    expect(
      screen.queryByText(/full name is required/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/full name must be at least 2 characters/i),
    ).not.toBeInTheDocument();
  });

  it("clears the error once a valid name is entered", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "J");
    await userEvent.tab();

    expect(
      screen.getByText(/full name must be at least 2 characters/i),
    ).toBeInTheDocument();

    await userEvent.type(nameInput, "ohn Doe");

    expect(
      screen.queryByText(/full name must be at least 2 characters/i),
    ).not.toBeInTheDocument();
    expect(nameInput).toHaveAttribute("aria-invalid", "false");
  });

  it("marks the name input as invalid via aria-invalid when the name is bad", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "x");
    await userEvent.tab();

    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAccessibleDescription(
      /full name must be at least 2 characters/i,
    );
  });

  it("treats a whitespace-only name as required", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "   ");
    await userEvent.tab();

    // .trim() in the schema turns "   " into "", so the required error fires
    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/full name must be at least 2 characters/i),
    ).not.toBeInTheDocument();
  });

  it("accepts a valid name with surrounding whitespace (trimmed)", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, " John Doe ");
    await userEvent.tab();

    expect(
      screen.queryByText(/full name must be at least 2 characters/i),
    ).not.toBeInTheDocument();
    expect(nameInput).toHaveAttribute("aria-invalid", "false");
  });

  it("rejects a name containing an emoji", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "John 👍");
    await userEvent.tab();

    expect(
      screen.getByText(/full name must not contain emoticons/i),
    ).toBeInTheDocument();
  });

  it("rejects a name containing a variation-selector emoji", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "Jane ☺️");
    await userEvent.tab();

    expect(
      screen.getByText(/full name must not contain emoticons/i),
    ).toBeInTheDocument();
  });

  it("accepts a name with accents and an apostrophe", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "Renée O'Mullony");
    await userEvent.tab();

    expect(
      screen.queryByText(/full name must not contain emoticons/i),
    ).not.toBeInTheDocument();
    expect(nameInput).toHaveAttribute("aria-invalid", "false");
  });

  it("accepts a name of exactly 2 characters", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "Jo");
    await userEvent.tab();

    expect(
      screen.queryByText(/full name must be at least 2 characters/i),
    ).not.toBeInTheDocument();
    expect(nameInput).toHaveAttribute("aria-invalid", "false");
  });

  it("accepts a name of exactly 250 characters", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "a".repeat(250));
    await userEvent.tab();

    expect(
      screen.queryByText(/full name must not exceed 250 characters/i),
    ).not.toBeInTheDocument();
    expect(nameInput).toHaveAttribute("aria-invalid", "false");
  });

  it("rejects a name of 251 characters", async () => {
    renderRegisterForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "a".repeat(251));
    await userEvent.tab();

    expect(
      screen.getByText(/full name must not exceed 250 characters/i),
    ).toBeInTheDocument();
  });
});
