import { makeTransient, triggerCallback } from "./vanilla";

test("triggerCallback", () => {
  const myFunction = jest.fn();
  const callback = jest.fn();

  const handler = makeTransient(myFunction);
  triggerCallback(handler, callback);
  handler();

  expect(callback).toHaveBeenCalled();
});
