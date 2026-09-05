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

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText(/full name/i), "John Doe");
  await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
  await userEvent.type(
    screen.getByLabelText(/^password$/i),
    "secret123",
  );
  await userEvent.type(
    screen.getByLabelText(/confirm password/i),
    "secret123",
  );
}

describe("RegisterForm - submit button gating", () => {
  it("starts disabled on an empty form", () => {
    renderRegisterForm();

    expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
  });

  it("stays disabled while any field is invalid", async () => {
    renderRegisterForm();

    await userEvent.type(screen.getByLabelText(/full name/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "not-an-email");
    await userEvent.type(
      screen.getByLabelText(/^password$/i),
      "secret123",
    );
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "secret123",
    );

    expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
  });

  it("stays disabled when the passwords do not match", async () => {
    renderRegisterForm();

    await userEvent.type(screen.getByLabelText(/full name/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "secret123");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "secret124",
    );

    expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
  });

  it("becomes enabled once every field is valid", async () => {
    renderRegisterForm();

    await fillValidForm();

    expect(screen.getByRole("button", { name: /register/i })).toBeEnabled();
  });

  it("becomes disabled again when a field turns invalid", async () => {
    renderRegisterForm();

    await fillValidForm();
    expect(screen.getByRole("button", { name: /register/i })).toBeEnabled();

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "broken-email");

    expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
  });
});

describe("RegisterForm - renders", () => {
  it("renders all fields and the login link", () => {
    renderRegisterForm();

    // CardTitle renders a <div data-slot="card-title">, not a heading.
    // Scope by selector since the submit button shares the "Register" text.
    expect(
      screen.getByText("Register", {
        selector: "[data-slot='card-title']",
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
