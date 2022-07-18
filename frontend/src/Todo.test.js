import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import Todo from "./Todo";

describe("Todo", function () {
  it("Should render the Todo component without crashing", async function () {
    render(<Todo />);

    const loadingElement = screen.getByText("Loading...");
    const loadingElementQuery = screen.queryByText("Loading");
    expect(loadingElement).toBeInTheDocument();
    await waitForElementToBeRemoved(() => {
      expect(loadingElementQuery).not.toBeInTheDocument();
    });
  });
});
