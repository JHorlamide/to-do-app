import { render, screen, fireEvent } from "@testing-library/react";
import CreateTodoForm from "..";

const mockSetTodo = jest.fn();

describe("Create todo form <CreateTodoForm />", () => {
  it("Should render the input field", function () {
    render(<CreateTodoForm setTodos={mockSetTodo} />);

    const inputElement = screen.getByPlaceholderText(/e.g go shopping/i);
    expect(inputElement).toBeInTheDocument();
  });

  it("Should be able to type in the input field", function () {
    render(<CreateTodoForm setTodos={mockSetTodo} />);

    const inputElement = screen.getByPlaceholderText(/e.g go shopping/i);
    fireEvent.change(inputElement, {
      target: { value: "Go Grocery shopping" },
    });
    expect(inputElement.value).toBe("Go Grocery shopping");
  });

  it("Should show input field value when the button is clicked without setting due date", function () {
    render(<CreateTodoForm setTodos={mockSetTodo} />);

    const inputElement = screen.getByPlaceholderText(/e.g go shopping/i);
    const buttonElement = screen.getByRole("button", { name: /add/i });
    fireEvent.change(inputElement, { target: { value: "Go shopping" } });
    fireEvent.click(buttonElement);
    expect(inputElement.value).toBe("Go shopping");
  });

  it("Should render the date select", function () {
    render(<CreateTodoForm setTodos={mockSetTodo} />);

    const selectElement = screen.getByTestId("datetime");
    expect(selectElement).toBeInTheDocument();
  });
});
