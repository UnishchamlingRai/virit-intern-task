import { render, screen } from "@testing-library/react";
import InputTask from "./InputTask";
import user from "@testing-library/user-event";
import { TodoContextProvider } from "../context/TodoContext";

test("it shows one input and one button", () => {
  render(
    <TodoContextProvider>
      <InputTask />
    </TodoContextProvider>
  );

  const input = screen.getByRole("textbox");
  const button = screen.getByRole("button", { name: /add/i });

  expect(input).toBeInTheDocument();
  expect(button).toBeInTheDocument();
});

test("it calls handleAddTask when the form is submitted", async () => {
  render(
    <TodoContextProvider>
      <InputTask />
    </TodoContextProvider>
  );

  // Simulate typing
  const input = screen.getByRole("textbox");
  await user.type(input, "task-1");

  // Simulate clicking the button
  const button = screen.getByRole("button", { name: /add/i });
  await user.click(button);

  // Assert that the input field is cleared after submission
  expect(input).toHaveValue("");
});
