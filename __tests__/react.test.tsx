import { fireEvent, render, screen } from "@testing-library/react";
import { useTransient, useTriggerCallback } from "../src";
import { SubscriptableFunction } from "../src/types";

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

  fireEvent.click(await screen.findByTestId("1"));

  expect(callback).toHaveBeenCalled();
});

test("child updates", async () => {
  const myFunction = jest.fn();
  const callback = jest.fn();

  let handler: SubscriptableFunction;

  function MyComponent() {
    handler = useTransient(myFunction);
    useTriggerCallback(handler, () => callback("root"));
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

  fireEvent.click(await screen.findByTestId("1"));

  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenNthCalledWith(1, "1");
  expect(callback).toHaveBeenNthCalledWith(2, "root");
});

test("multiple child() ", async () => {
  const myFunction = jest.fn();
  const callback = jest.fn();

  let handler: SubscriptableFunction;

  function MyComponent() {
    handler = useTransient(myFunction);
    useTriggerCallback(handler, () => callback("root"));
    return (
      <>
        <MyButton id="1" onClick={handler} />
        <Layer1 onClick={handler} />
      </>
    );
  }

  function Layer1({ onClick }: any) {
    const childOnClick = onClick.useChild();
    useTriggerCallback(childOnClick, () => callback("layer1"));

    return (
      <>
        <MyButton id="1-1" onClick={childOnClick} />
        <MyButton id="1-2" onClick={childOnClick} />
        <Layer2 onClick={childOnClick} />
      </>
    );
  }

  function Layer2({ onClick }: any) {
    const childOnClick = onClick.useChild();
    useTriggerCallback(childOnClick, () => callback("layer2"));

    return (
      <>
        <MyButton id="2-1" onClick={childOnClick} />
        <MyButton id="2-2" onClick={childOnClick} />
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

  fireEvent.click(await screen.findByTestId("1"));
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenNthCalledWith(1, "1");
  expect(callback).toHaveBeenNthCalledWith(2, "root");

  callback.mockReset();

  fireEvent.click(await screen.findByTestId("1-1"));
  expect(callback).toHaveBeenCalledTimes(3);
  expect(callback).toHaveBeenNthCalledWith(1, "1-1");
  expect(callback).toHaveBeenNthCalledWith(2, "layer1");
  expect(callback).toHaveBeenNthCalledWith(3, "root");

  callback.mockReset();

  fireEvent.click(await screen.findByTestId("2-1"));
  expect(callback).toHaveBeenCalledTimes(4);
  expect(callback).toHaveBeenNthCalledWith(1, "2-1");
  expect(callback).toHaveBeenNthCalledWith(2, "layer2");
  expect(callback).toHaveBeenNthCalledWith(3, "layer1");
  expect(callback).toHaveBeenNthCalledWith(4, "root");
});
