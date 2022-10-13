import { useEffect, useMemo, useId } from "react";
import { SubscriptableFunction, Func, key } from "./types";
import { makeTransient, triggerCallback } from "./vanilla";

export function useTransient(userFunction: Function) {
  return useMemo(() => {
    const fn = Object.assign(makeTransient(userFunction), {
      child() {
        throw new Error(
          "child() will have undesired effects in React. Please use useSplit()."
        );
      },
      useChild() {
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
