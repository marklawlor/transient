import { fireEvent, render, screen } from "@testing-library/react";
import { useTransient, useTriggerCallback } from "./react";
import { SubscriptableFunction } from "./types";

test("update", async () => {
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

test("child updates", async () => {
  const myFunction = jest.fn();
  const callback = jest.fn();

  let handler: SubscriptableFunction;

  function MyComponent() {
    handler = useTransient(myFunction);
    useTriggerCallback(handler, () => callback("parent"));
    return (
      <>
        <MyButton id="1" onClick={handler} />
        <MyButton id="2" onClick={handler} />
      </>
    );
  }

  function MyButton({ id, onClick }: any) {
    const childOnClick = onClick.useChild();
    useTriggerCallback(childOnClick, () => callback(id));
    return <div data-testid={id} onClick={childOnClick} />;
  }

  render(<MyComponent />);

  expect(callback).not.toHaveBeenCalled();

  const div1 = await screen.findByTestId("1");
  fireEvent.click(div1);

  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenNthCalledWith(1, "1");
  expect(callback).toHaveBeenNthCalledWith(2, "parent");
});
