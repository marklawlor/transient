import { fireEvent, render, screen } from "@testing-library/react";
import { useTransient, useTriggerCallback } from "./react";
import { SubscriptableFunction } from "./types";

test("store update", async () => {
  const myFunction = jest.fn();
  const callback = jest.fn();

  let handler: SubscriptableFunction;

  function MyComponent() {
    handler = useTransient(myFunction);
    useTriggerCallback(handler, callback);
    return <div data-testid="1" onClick={handler} />;
  }

  render(<MyComponent />);

  expect(callback).not.toHaveBeenCalled();

  const div1 = await screen.findByTestId("1");
  fireEvent.click(div1);

  expect(callback).toHaveBeenCalled();
});
