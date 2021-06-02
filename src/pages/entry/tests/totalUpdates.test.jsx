import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderDetailsProvider } from "../../../contexts/OrderDetails";
import OrderEntry from "../OrderEntry";
import Options from "../Options";

test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />, { wrapper: OrderDetailsProvider });

  //make sure total starts out 0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", {
    exact: false,
  });

  expect(scoopsSubtotal).toHaveTextContent("0.00");

  //update vanilla scoops to 1 and check the SUBTOTAL changes

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");

  expect(scoopsSubtotal).toHaveTextContent("2.00");

  //update chocolate scoops to 2 and check SUBTOTAL
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");

  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update topping subtotal when toppings change", async () => {
  render(<Options optionType="toppings" />, { wrapper: OrderDetailsProvider });

  //make sure total starts out at 0.00
  const toppingSubtotal = screen.getByText("toppings total: $", {
    exact: false,
  });

  expect(toppingSubtotal).toHaveTextContent("0.00");

  //click cherriesCheckbox
  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  userEvent.click(cherriesCheckbox);

  //test subTotal
  expect(toppingSubtotal).toHaveTextContent("1.50");

  //click hotFudge checkbox (no need to await)
  const hotFudgeCheckBox = screen.getByRole("checkbox", {
    name: "Hot fudge",
  });

  userEvent.click(hotFudgeCheckBox);

  //test subTotal
  expect(toppingSubtotal).toHaveTextContent("3.00");

  //unclick hotFudge checkboxLabel
  userEvent.click(hotFudgeCheckBox);

  expect(toppingSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total starts at $0.00", () => {
    render(<OrderEntry />, { wrapper: OrderDetailsProvider });
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    expect(grandTotal).toHaveTextContent("0.00");
  });

  test("grand total updates properly if scoop is added first", async () => {
    render(<OrderEntry />, { wrapper: OrderDetailsProvider });
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });

    userEvent.clear(vanillaInput);

    userEvent.type(vanillaInput, "2");

    expect(grandTotal).toHaveTextContent("4.00");

    const cherryCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    userEvent.click(cherryCheckbox);

    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if topping is added first", async () => {
    render(<OrderEntry />, { wrapper: OrderDetailsProvider });

    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    expect(grandTotal).toHaveTextContent("0.00");

    const cherryCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    userEvent.click(cherryCheckbox);

    expect(grandTotal).toHaveTextContent("1.5");

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });

    userEvent.type(vanillaInput, "2");

    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if item is removed", async () => {
    render(<OrderEntry />, { wrapper: OrderDetailsProvider });

    const cherryCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    userEvent.click(cherryCheckbox);

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });

    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");

    //remove 1 scoop of vanillaInput
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "1");

    //check grand totals
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    expect(grandTotal).toHaveTextContent("3.50");

    userEvent.click(cherryCheckbox);

    expect(grandTotal).toHaveTextContent("2.00");
  });
});
