import { useEffect, useMemo, useId } from "react";
import { SubscriptableFunction, Func } from "./types";
import { makeTransient, Transient, triggerCallback } from "./vanilla";

export interface ReactTransient extends Transient {
  useChild: () => ReactTransient;
}

export function useTransient(userFunction: Func): ReactTransient {
  return useMemo(
    () => makeReactTransient(makeTransient(userFunction)),
    [userFunction]
  );
}

function makeReactTransient(transient: Transient): ReactTransient {
  return Object.assign(transient, {
    useChild() {
      return makeReactTransient(transient.child(useId()));
    },
  });
}

export function useTriggerCallback(fn: SubscriptableFunction, callback: Func) {
  useEffect(() => triggerCallback(fn, callback), [fn, callback]);
}
