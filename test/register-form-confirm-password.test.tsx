import { fireEvent, render, screen, within } from "@testing-library/react";
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

const VALID_PASSWORD = "secret123"

function getConfirmPasswordInput() {
  return screen.getByLabelText(/confirm password/i);
}

describe("RegisterForm - confirm password field validation", () => {
  it("shows an error when the confirm password is empty and blurred", async () => {
    renderRegisterForm();

    const confirmInput = getConfirmPasswordInput();
    await userEvent.click(confirmInput);
    await userEvent.tab();

    expect(
      screen.getByText(/confirm password is required/i),
    ).toBeInTheDocument();
  });

  it("does not show an error before the field is touched", () => {
    renderRegisterForm();

    expect(
      screen.queryByText(/confirm password is required/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/passwords do not match/i),
    ).not.toBeInTheDocument();
  });

  it("shows an error when the confirm password does not match", async () => {
    renderRegisterForm();

    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, VALID_PASSWORD);

    const confirmInput = getConfirmPasswordInput();
    await userEvent.type(confirmInput, "different");
    await userEvent.tab();

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("clears the mismatch error once the confirm password matches", async () => {
    renderRegisterForm();

    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, VALID_PASSWORD);

    const confirmInput = getConfirmPasswordInput();
    await userEvent.type(confirmInput, "different");
    await userEvent.tab();

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();

    await userEvent.clear(confirmInput);
    await userEvent.type(confirmInput, VALID_PASSWORD);

    expect(
      screen.queryByText(/passwords do not match/i),
    ).not.toBeInTheDocument();
    expect(confirmInput).toHaveAttribute("aria-invalid", "false");
  });

  it("marks the confirm input as invalid via aria-invalid on mismatch", async () => {
    renderRegisterForm();

    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, VALID_PASSWORD);

    const confirmInput = getConfirmPasswordInput();
    await userEvent.type(confirmInput, "secret12"); // one char short
    await userEvent.tab();

    expect(confirmInput).toHaveAttribute("aria-invalid", "true");
    expect(confirmInput).toHaveAccessibleDescription(/passwords do not match/i);
  });

  it("re-validates the confirm error when the password changes after both matched", async () => {
    renderRegisterForm();

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = getConfirmPasswordInput();

    await userEvent.type(passwordInput, VALID_PASSWORD);
    await userEvent.type(confirmInput, VALID_PASSWORD);
    await userEvent.tab();

    expect(
      screen.queryByText(/passwords do not match/i),
    ).not.toBeInTheDocument();

    // Editing the password after both fields matched must re-surface the
    // mismatch (the confirm field stays touched)
    await userEvent.type(passwordInput, "9");

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(confirmInput).toHaveAttribute("aria-invalid", "true");
  });

  it("shows the required error (not the mismatch error) when both are empty", async () => {
    renderRegisterForm();

    const confirmInput = getConfirmPasswordInput();
    await userEvent.click(confirmInput);
    await userEvent.tab();

    // "" === "" so the superRefine match passes; the min(1) fires first
    expect(
      screen.getByText(/confirm password is required/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/passwords do not match/i),
    ).not.toBeInTheDocument();
  });

  it("toggles confirm-password visibility independently", async () => {
    renderRegisterForm();

    const confirmInput = getConfirmPasswordInput();
    expect(confirmInput).toHaveAttribute("type", "password");

    const wrapper = confirmInput.closest(".relative") as HTMLElement;
    const toggleButton = within(wrapper).getByRole("button", {
      name: /show password/i,
    });
    await userEvent.click(toggleButton);

    expect(confirmInput).toHaveAttribute("type", "text");
    // The other password field must stay hidden
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("shows the confirm-password error via fireEvent without a real blur", async () => {
    // userEvent.clear() + type() keeps focus in the field, and the confirm
    // input is last in the tab order, so use fireEvent.change to drive the
    // onChange path (which also marks the field as touched)
    renderRegisterForm();

    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, VALID_PASSWORD);

    const confirmInput = getConfirmPasswordInput();
    fireEvent.change(confirmInput, { target: { value: "nope" } });

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
