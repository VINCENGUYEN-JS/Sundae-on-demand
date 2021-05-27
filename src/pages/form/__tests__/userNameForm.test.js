import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import user from "@testing-library/user-event";
import UsernameForm from "../userNameForm";

test("calls updateUsernam with the new username(with act warning)", async () => {
  const promise = Promise.resolve();
  const handleUpdateUsername = jest.fn(() => promise);
  const fakeUserName = "Vince Nguyen";

  render(<UsernameForm updateUsername={handleUpdateUsername} />);

  const userNameInput = screen.getByLabelText(/username/i);

  user.type(userNameInput, fakeUserName);

  user.click(screen.getByText(/submit/i));

  expect(handleUpdateUsername).toHaveBeenCalledWith(fakeUserName);
  expect(handleUpdateUsername).toHaveBeenCalledTimes(1);

  await act(() => promise);
});
