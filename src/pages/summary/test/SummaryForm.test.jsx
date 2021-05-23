import { render, screen, fireEvent } from "@testing-library/react";
import SummaryForm from "../SummaryForm.jsx";

test("Initial conditions", () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: "I agree to Terms and Conditions",
  });
  expect(checkbox).not.toBeChecked();

  const confirmButton = screen.getByRole("button", {
    name: "Confirm order",
  });

  expect(confirmButton).toBeDisabled();
});

test("Checkbox enable button on first click and disable on second click", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: "I agree to Terms and Conditions",
  });

  fireEvent.click(checkbox);

  const confirmButton = screen.getByRole("button", {
    name: "Confirm order",
  });

  expect(confirmButton).toBeEnabled();

  fireEvent.click(checkbox);

  expect(confirmButton).toBeDisabled();
});
