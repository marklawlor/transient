import { useEffect, useMemo, useId } from "react";
import { SubscriptableFunction, Func, key } from "./types";
import { makeTransient, triggerCallback } from "./vanilla";

export function useTransient(userFunction: Function) {
  return useMemo(() => {
    const fn = Object.assign(makeTransient(userFunction), {
      split() {
        throw new Error(
          "split() will have undesired effects in React. Please use useSplit()."
        );
      },
      useSplit() {
        return makeTransient(userFunction, `${fn[key]}_${useId()}`);
      },
    });

    return fn;
  }, [userFunction]);
}

export function useTriggerCallback(fn: SubscriptableFunction, callback: Func) {
  useEffect(() => {
    return triggerCallback(fn, callback);
  }, [fn, callback]);
}
